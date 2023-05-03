// @ts-check

export default {
  translation: {
    appName: 'Fastify Шаблон',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        delete: {
          error: 'Вы не можете редактировать или удалять другого пользователя',
          errorAuth: 'Не удалось удалить пользователя',
          info: 'Пользователь успешно удалён',
        },
        edit: {
          error: 'Вы не можете редактировать или удалять другого пользователя',
          failed: 'Не удалось изменить пользователя',
          info: 'Пользователь успешно изменён',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        delete: {
          error: 'Не удалось удалить статус',
          info: 'Статус успешно удалён',
        },
        edit: {
          error: 'Не удалось изменить статус',
          info: 'Статус успешно изменён',
        },
      },
      tags: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        delete: {
          error: 'Не удалось удалить метку',
          info: 'Метка успешно удалена',
        },
        edit: {
          error: 'Не удалось изменить метку',
          info: 'Метка успешно изменена',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        delete: {
          error: 'Задачу может удалить только её автор',
          info: 'Задача успешно удалена',
        },
        edit: {
          error: 'Не удалось изменить задачу',
          info: 'Задача успешно изменена',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статусы',
        marks: 'Метки',
        tasks: 'Задачи',
      },
    },
    views: {
      labels: {
        email: 'Email',
        password: 'Пароль',
        firstName: 'Имя',
        lastName: 'Фамилия',
        name: 'Наименование',
        description: 'Описание',
        statusId: 'Статус',
        executorId: 'Исполнитель',
        labels: 'Метки',
      },
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
          password: 'Пароль',
        },
      },
      marks: {
        header: 'Метки',
        change: 'Создать метку',
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        alter: 'Изменить',
        delete: 'Удалить',
        new: {
          submit: 'Создать метку',
          send: 'Создать',
          create: 'Создание метки',
        },
        edit: {
          header: 'Изменение метки',
          submit: 'Изменить',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        header: 'Статусы',
        create: 'Создать статус',
        alter: 'Изменить',
        delete: 'Удалить',
        edit: {
          header: 'Изменение статуса',
          submit: 'Изменить',
        },
        new: {
          submit: 'Создать',
          create: 'Создание статуса',
        },
      },
      tasks: {
        header: 'Задачи',
        id: 'ID',
        name: 'Наименование',
        status: 'Статус',
        author: 'Автор',
        responsible: 'Исполнитель',
        createdAt: 'Дата создания',
        alter: 'Изменить',
        delete: 'Удалить',
        search: {
          show: 'Показать',
          myTasks: 'Только мои задачи',
          status: 'Статус',
          executor: 'Исполнитель',
          tag: 'Метка',
        },
        new: {
          submit: 'Создать задачу',
          send: 'Создать',
          create: 'Создание задачи',
        },
        edit: {
          header: 'Изменение задачи',
          submit: 'Изменить',
        },
      },
      users: {
        id: 'ID',
        fullName: 'Полное имя',
        email: 'Email',
        createdAt: 'Дата создания',
        actions: 'Действия',
        change: 'Изменить',
        delete: 'Удалить',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          header: 'Изменение пользователя',
          submit: 'Изменить',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
