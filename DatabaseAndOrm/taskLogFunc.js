const TaskStatusLog = require('./taskLogModel');
const { fork } = require('child_process');
const { time } = require('console');
const schedule = require('node-schedule');
const path = require('path');

const avitoParserPath = path.resolve(__dirname, '../request_avito_parser');
const cianParserPath = path.resolve(__dirname, '../request_cian_parser');
const mirkvParserPath = path.resolve(__dirname, '../request_mirkv_parser');
const moveParserPath = path.resolve(__dirname, '../request_move_parser');
const importPath = path.resolve(__dirname, './import');



async function logTaskStatus(taskId, taskType, status) {
  try {
    await TaskStatusLog.create({
      task_id: taskId,
      task_type: taskType,
      status: status
    });
    console.log(`Task ${taskId} status updated to: ${status}`);
  } catch (error) {
    console.error('Error logging task status:', error);
  }
}

async function getNextTaskId() {
  try {
    // Находим максимальное значение taskId в базе данных
    const maxTask = await TaskStatusLog.findOne({
      attributes: [[TaskStatusLog.sequelize.fn('MAX', TaskStatusLog.sequelize.col('task_id')), 'maxTaskId']]
    });

    // Извлекаем максимальное значение
    const maxTaskId = maxTask && maxTask.get('maxTaskId') !== null 
      ? parseInt(maxTask.get('maxTaskId'), 10) 
      : 0;

    // Возвращаем новый taskId
    return maxTaskId + 1;
  } catch (error) {
      console.error('Error fetching max task ID:', error);
      throw new Error('Не удалось получить taskId');
  }
}

function scheduleTask(taskType, scheduledTime, scriptPath) {
    schedule.scheduleJob(scheduledTime, async () => {
      const taskId = await getNextTaskId();
      // Логируем начало выполнения задачи
      await logTaskStatus(taskId, taskType, 'выполняется');
  
      try {
        console.log(`Running task ${taskId}...`);
        const child = fork(scriptPath); // Запускаем указанный файл
  
        child.on('message', message => {
          console.log(`Message from task ${taskId}:`, message);
        });
  
        child.on('exit', async code => {
          if (code === 0) {
            console.log(`Task ${taskId} completed successfully.`);
            await logTaskStatus(taskId, taskType, 'выполнено');
          } else {
            console.error(`Task ${taskId} failed with exit code ${code}.`);
            await logTaskStatus(taskId, taskType, 'ошибка');
          }
        });
  
        child.on('error', async error => {
          console.error(`Error in task ${taskId}:`, error);
          await logTaskStatus(taskId, taskType, 'ошибка');
        });
      } catch (error) {
        console.error(`Error while running task ${taskId}:`, error);
        await logTaskStatus(taskId, taskType, 'ошибка');
      }
    });
    console.log(`Task ${taskType} scheduled for ${scheduledTime}`);
}


const newTime = new Date(Date.now() + 10*1000);

//Примеры задач для выполнения
scheduleTask('Парсинг', newTime, avitoParserPath);
scheduleTask('Импортирование данных', newTime, importPath);