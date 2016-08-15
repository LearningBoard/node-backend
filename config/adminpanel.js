'use strict';

module.exports.adminpanel = {

  // Menu groups
  menu: {
    brand: 'Learning Board - Admin Panel',
    groups: [
      {
        key: 'lb',
        title: 'Learning Board'
      },
      {
        key: 'user',
        title: 'Users'
      },
      {
        key: 'admin',
        title: 'Administration'
      }
    ]
  },

  instances: {

    // User group
    user: {
      menuGroup: 'user',
      title: 'Users',
      model: 'User',
      fields: {
        id: false,
        username: 'Username',
        email: 'Email',
        passports: {
          title: 'Passport',
          model: 'Passport',
          displayField: 'provider'
        },
        roles: {
          title: 'Role',
          model: 'Role',
          displayField: 'name'
        },
        permissions: false,
        subscribedlb: {
          title: 'Subscribed Learning Board',
          model: 'LearningBoard',
          displayField: 'title'
        },
        info: 'Info',
        likedlb: {
          title: 'Liked Learning Board',
          model: 'LearningBoard',
          displayField: 'title'
        },
        likedactivities: {
          title: 'Liked Activity',
          model: 'Activity',
          displayField: 'title'
        },
        completedactivities: {
          title: 'Completed Activity',
          model: 'Activity',
          displayField: 'title'
        },
        owner: false,
        createdBy: false,
        createdAt: {
          title: 'Created',
          type: 'datetime'
        },
        updatedAt: {
          title: 'Updated',
          type: 'datetime'
        }
      },
      list: {
        fields: {
          subscribedlb: false,
          likedlb: false,
          likedactivities: false,
          completedactivities: false,
          createdAt: false,
          updatedAt: false
        }
      },
      add: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      },
      edit: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      }
    },

    // Learning Board group
    learningboard: {
      menuGroup: 'lb',
      title: 'Learning Board',
      model: 'LearningBoard',
      fields: {
        id: false,
        title: 'Title',
        description: 'Description',
        coverImage: false,
        author: {
          title: 'Author',
          model: 'User',
          displayField: 'username'
        },
        category: {
          title: 'Category',
          model: 'Category',
          displayField: 'category'
        },
        level: {
          title: 'Content Level',
          enum: {
            0: 'Beginner',
            1: 'Intermediate',
            2: 'Advanced'
          }
        },
        tags: {
          title: 'Tags',
          model: 'Tag',
          displayField: 'tag'
        },
        publish: 'Published',
        activities: {
          title: 'Activity',
          model: 'Activity',
          displayField: 'title'
        },
        subscribe: false,
        endorsement: false,
        like: false,
        news: false,
        owner: false,
        createdBy: false,
        createdAt: {
          title: 'Created',
          type: 'datetime'
        },
        updatedAt: {
          title: 'Updated',
          type: 'datetime'
        }
      },
      list: {
        fields: {
          description: false,
          tags: false,
          activities: false,
          createdAt: false,
          updatedAt: false
        }
      },
      add: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      },
      edit: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      }
    },

    activity: {
      menuGroup: 'lb',
      title: 'Activity',
      model: 'Activity',
      fields: {
        id: false,
        title: 'Title',
        description: {
          title: 'Description',
          type: 'text',
          editor: true
        },
        type: 'Type',
        data: 'Data',
        lb: {
          title: 'Learning Board',
          model: 'LearningBoard',
          displayField: 'title'
        },
        publish: 'Published',
        order: 'Order',
        author: {
          title: 'Author',
          model: 'User',
          displayField: 'username'
        },
        like: false,
        complete: false,
        comments: false,
        owner: false,
        createdBy: false,
        createdAt: {
          title: 'Created',
          type: 'datetime'
        },
        updatedAt: {
          title: 'Updated',
          type: 'datetime'
        }
      },
      list: {
        fields: {
          description: false,
          data: false,
          order: false,
          createdAt: false,
          updatedAt: false
        }
      },
      add: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      },
      edit: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      }
    },

    comment: {
      menuGroup: 'lb',
      title: 'Comment',
      model: 'Comment',
      fields: {
        id: false,
        comment: 'Comment',
        author: {
          title: 'Author',
          model: 'User',
          displayField: 'username'
        },
        activity: {
          title: 'Activity',
          model: 'Activity',
          displayField: 'title'
        },
        owner: false,
        createdBy: false,
        createdAt: {
          title: 'Created',
          type: 'datetime'
        },
        updatedAt: {
          title: 'Updated',
          type: 'datetime'
        }
      },
      list: {
        fields: {
          updatedAt: false
        }
      },
      edit: false
    },

    news: {
      menuGroup: 'lb',
      title: 'News',
      model: 'News',
      fields: {
        id: false,
        title: 'Title',
        text: {
          title: 'News Content',
          type: 'text',
          editor: true
        },
        lb: {
          title: 'Learning Board',
          model: 'LearningBoard',
          displayField: 'title'
        },
        author: {
          title: 'Author',
          model: 'User',
          displayField: 'username'
        },
        owner: false,
        createdBy: false,
        createdAt: {
          title: 'Created',
          type: 'datetime'
        },
        updatedAt: {
          title: 'Updated',
          type: 'datetime'
        }
      },
      list: {
        fields: {
          text: false
        }
      },
      add: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      },
      edit: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      }
    },

    category: {
      menuGroup: 'lb',
      title: 'Category',
      model: 'Category',
      fields: {
        id: false,
        category: 'Category',
        owner: false,
        createdBy: false,
        createdAt: {
          title: 'Created',
          type: 'datetime'
        },
        updatedAt: {
          title: 'Updated',
          type: 'datetime'
        }
      },
      add: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      },
      edit: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      }
    },

    tag: {
      menuGroup: 'lb',
      title: 'Tag',
      model: 'Tag',
      fields: {
        id: false,
        tag: 'Tag',
        owner: false,
        createdBy: false,
        createdAt: {
          title: 'Created',
          type: 'datetime'
        },
        updatedAt: {
          title: 'Updated',
          type: 'datetime'
        }
      },
      add: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      },
      edit: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      }
    },

    // Administration group
    role: {
      menuGroup: 'admin',
      title: 'Role',
      model: 'Role',
      fields: {
        id: false,
        name: 'Name',
        users: {
          title: 'User',
          model: 'User',
          displayField: 'username'
        },
        active: 'Active',
        permissions: {
          title: 'Permission',
          model: 'Permission'
        },
        owner: false,
        createdBy: false,
        createdAt: {
          title: 'Created',
          type: 'datetime'
        },
        updatedAt: {
          title: 'Updated',
          type: 'datetime'
        }
      },
      list: {
        fields: {
          users: false,
          permissions: false,
          createdAt: false
        }
      },
      add: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      },
      edit: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      }
    },

    permission: {
      menuGroup: 'admin',
      title: 'Permission',
      model: 'Permission',
      fields: {
        id: false,
        model: {
          title: 'Model',
          model: 'Model',
          displayField: 'name'
        },
        action: {
          title: 'Action',
          enum: {
            'create': 'Create',
            'read': 'Read',
            'update': 'Update',
            'delete': 'Delete'
          }
        },
        relation: {
          title: 'Relation',
          enum: {
            'role': 'Role',
            'owner': 'Owner',
            'user': 'User'
          }
        },
        role: {
          title: 'Role',
          model: 'Role',
          displayField: 'name'
        },
        user: {
          title: 'User',
          model: 'User',
          displayField: 'username'
        },
        criteria: false,
        owner: false,
        createdBy: false,
        createdAt: {
          title: 'Created',
          type: 'datetime'
        },
        updatedAt: {
          title: 'Updated',
          type: 'datetime'
        }
      },
      list: {
        fields: {
          user: false,
          createdAt: false
        }
      },
      add: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      },
      edit: {
        fields: {
          createdAt: false,
          updatedAt: false
        }
      }
    },

    requestlog: {
      menuGroup: 'admin',
      title: 'Request Log',
      model: 'RequestLog',
      fields: {
        id: false,
        ipAddress: 'IP Address',
        method: 'Method',
        url: 'URL',
        body: 'Body',
        user: {
          title: 'User',
          model: 'User',
          displayField: 'username'
        },
        model: {
          title: 'Model',
          model: 'Model',
          displayField: 'name'
        },
        createdAt: {
          title: 'Created',
          type: 'datetime'
        }
      },
      list: {
        fields: {
          body: false,
          model: false
        }
      },
      edit: false,
      remove: false
    }
  }
};
