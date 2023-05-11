// @ts-check

export default {
  translation: {
    appName: 'Task manager',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        delete: {
          error: 'You can\'t edit or delete another user',
          errorAuth: 'Failed to delete user',
          info: 'User deleted successfully',
        },
        edit: {
          error: 'You can\'t edit or delete another user',
          failed: 'Failed to change user',
          info: 'User successfully changed',
        },
      },
      statuses: {
        create: {
          error: 'Failed to create status',
          success: 'Status created successfully',
        },
        delete: {
          error: 'Failed to delete status',
          info: 'Status deleted successfully',
        },
        edit: {
          error: 'Failed to change status',
          info: 'Status is changed',
        },
      },
      tags: {
        create: {
          error: 'Failed to create tag',
          success: 'Tag created successfully',
        },
        delete: {
          error: 'Failed to delete tag',
          info: 'Tag deleted successfully',
        },
        edit: {
          error: 'Failed to change tag',
          info: 'Tag changed successfully',
        },
      },
      tasks: {
        create: {
          error: 'Failed to create task',
          success: 'Task created successfully',
        },
        delete: {
          error: 'Task can be deleted only by its author',
          info: 'Task deleted successfully',
        },
        edit: {
          error: 'Failed to change task',
          info: 'Task changed successfully',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
        statuses: 'Statuses',
        marks: 'Tags',
        tasks: 'Tasks',
      },
    },
    views: {
      labels: {
        email: 'Email',
        password: 'Password',
        firstName: 'First name',
        lastName: 'Last Name',
        name: 'Name',
        desciption: 'Desciption',
        statusId: 'Status',
        executorId: 'Executor',
        labels: 'Labels',
      },
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
          password: 'Password',
        },
      },
      marks: {
        header: 'Tags',
        change: 'Create tag',
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        actions: 'Actions',
        alter: 'Change',
        delete: 'Delete',
        new: {
          submit: 'Create label',
          send: 'Create',
          create: 'Tag creating',
        },
        edit: {
          header: 'Change tag',
          submit: 'Change',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        actions: 'Actions',
        header: 'Statuses',
        create: 'Create status',
        alter: 'Change',
        delete: 'Delete',
        edit: {
          header: 'Change status',
          submit: 'Change',
        },
        new: {
          submit: 'Create',
          create: 'Status creating',
        },
      },
      tasks: {
        header: 'Tasks',
        id: 'ID',
        name: 'Name',
        status: 'Status',
        author: 'Author',
        responsible: 'Executor',
        createdAt: 'Created at',
        alter: 'Change',
        delete: 'Delete',
        search: {
          show: 'Show',
          myTasks: 'Only my tasks',
          status: 'Status',
          executor: 'Executor',
          tag: 'Tag',
        },
        new: {
          submit: 'Create task',
          send: 'Create',
          create: 'Task creating',
        },
        edit: {
          header: 'Change task',
          submit: 'Change',
        },
      },
      users: {
        id: 'ID',
        header: 'Users',
        fullName: 'Full name',
        email: 'Email',
        createdAt: 'Created at',
        actions: 'Actions',
        change: 'Change',
        delete: 'Delete',
        new: {
          submit: 'Register',
          signUp: 'Register',
          create: 'Registration',
        },
        edit: {
          header: 'Edit user',
          submit: 'Edit',
        },
      },
      welcome: {
        index: {
          hello: 'Hello from Hexlet!',
          description: 'Online programming school',
          more: 'Learn more',
        },
      },
    },
  },
};
