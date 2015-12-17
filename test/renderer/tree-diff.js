'use strict';

const treeDiff = Editor.require('packages://hierarchy/utils/tree-diff');

describe('smoke testing', function() {
  it('should pass if lastRoots is nil', function() {
    var diff = treeDiff(null, []);
    expect(diff).to.deep.equal({
      cmds: [],
      equal: true
    });
  });
  it('should pass if no element', function() {
    var newData = [];
    var oldData = [];
    var diff = treeDiff(oldData, newData);
    expect(diff).to.deep.equal({
      cmds: [],
      equal: true
    });
  });
});

describe('diff result', function() {
  it('should equal if the same', function() {
    function getRandomTree () {
      return [
        {
          id: 0,
          name: '',
          children: [
            {
              id: 1,
              name: 'Honey',
              children: [
                {
                  id: 2,
                  name: 'Darling',
                  children: null
                }
              ]
            },
            {
              id: 15,
              name: 'Daddy',
              children: null
            }
          ]
        },
        {
          id: 5,
          name: '',
          children: null
        }
      ];
    }
    var diff = treeDiff(getRandomTree(), getRandomTree());
    expect(diff).to.deep.equal({
      cmds: [],
      equal: true
    });
  });

  describe('attribute changes', function() {
    it('should be detected', function() {
      var oldData = [
        {
          id: 0,
          name: '0',
          children: null,
          isActive: false,
          isPrefab: true,
        },
        {
          id: 4,
          name: '4',
          children: null,
          isActive: true,
          isPrefab: false,
        }
      ];
      var newData = [
        {
          id: 0,
          name: 'Zero',
          children: null,
          isActive: true,
          isPrefab: false,
        },
        {
          id: 4,
          name: 'Four',
          children: null,
          isActive: false,
          isPrefab: true
        }
      ];
      var diff = treeDiff(oldData, newData);
      expect(diff).to.deep.equal({
        cmds: [
          {
            op: 'set-property',
            id: 0,
            property: 'name',
            value: 'Zero'
          },
          {
            op: 'set-property',
            id: 0,
            property: 'isPrefab',
            value: false
          },
          {
            op: 'set-property',
            id: 0,
            property: 'isActive',
            value: true
          },
          {
            op: 'set-property',
            id: 4,
            property: 'name',
            value: 'Four'
          },
          {
            op: 'set-property',
            id: 4,
            property: 'isPrefab',
            value: true
          },
          {
            op: 'set-property',
            property: 'isActive',
            id: 4,
            value: false
          },
        ],
        equal: false
      });
    });
  });

  describe('root changes', function() {
    it('should be detected if add elements', function() {
      var oldData = [];
      var newData = [
        {
          id: 0,
          name: '0',
          children: null
        },
        {
          id: 5,
          name: '5',
          children: null
        }
      ];
      var diff = treeDiff(oldData, newData);
      expect(diff).to.deep.equal({
        cmds: [
          {
            op: 'append',
            parentId: null,
            node: {
              id: 0,
              name: '0',
              children: null
            }
          },
          {
            op: 'append',
            parentId: null,
            node: {
              id: 5,
              name: '5',
              children: null
            }
          }
        ],
        equal: false
      });
    });

    it('should be detected if remove elements', function() {
      var oldData = [
        {
          id: 0,
          name: '0',
          children: null
        },
        {
          id: 5,
          name: '5',
          children: null
        },
        {
          id: 15,
          name: '15',
          children: null
        }
      ];
      var newData = [
        {
          id: 0,
          name: '0',
          children: null
        }
      ];
      var diff = treeDiff(oldData, newData);
      expect(diff).to.deep.equal({
        cmds: [
          {
            op: 'remove',
            id: 5,
          },
          {
            op: 'remove',
            id: 15,
          }
        ],
        equal: false
      });
    });
  });

  describe('child changes', function() {
    it('should be detected if remove child', function () {
      var oldData = [
        {
          id: '0',
          name: '',
          children: [
            {
              id: '0-0',
              name: '',
              children: [
                {
                  id: '0-0-0',
                  name: '',
                  children: null
                }
              ]
            },
            {
              id: '0-1',
              name: '',
              children: [
                {
                  id: '0-1-0',
                  name: '',
                  children: null
                }
              ]
            }
          ]
        }
      ];
      var newData = [
        {
          id: '0',
          name: '',
          children: [
            {
              id: '0-0',
              name: '',
              children: null
            }
          ]
        }
      ];
      var diff = treeDiff(oldData, newData);
      Editor.log(diff);
      expect(diff).to.deep.equal({
        cmds: [
          {
            op: 'remove',
            id: '0-0-0',
          },
          {
            op: 'remove',
            id: '0-1',
          }
        ],
        equal: false
      });
    });
    it('should be detected if add children', function () {
      var oldData = [
        {
          id: '0',
          name: '',
          children: [
            {
              id: '0-0',
              name: '',
              children: null
            }
          ]
        }
      ];
      var newData = [
        {
          id: '0',
          name: '',
          children: [
            {
              id: '0-0',
              name: '',
              children: [
                {
                  id: '0-0-0',
                  name: '',
                  children: null
                }
              ]
            },
            {
              id: '0-1',
              name: '',
              children:  [
                {
                  id: '0-1-0',
                  name: '',
                  children: null
                }
              ]
            }
          ]
        }
      ];
      var diff = treeDiff(oldData, newData);
      Editor.log(diff);
      expect(diff).to.deep.equal({
        cmds: [
          {
            op: 'append',
            parentId: '0-0',
            node: {
              id: '0-0-0',
              name: '',
              children: null
            }
          },
          {
            op: 'append',
            parentId: '0',
            node: {
              id: '0-1',
              name: '',
              children:  [
                {
                  id: '0-1-0',
                  name: '',
                  children: null
                }
              ]
            }
          }
        ],
        equal: false
      });
    });
  });

  describe('inserting one node', function() {
    it('should be detected', function() {
      var oldData = [
        {
          id: 4,
          name: '4',
          children: null
        }
      ];
      var newData = [
        {
          id: 0,
          name: 'Zero',
          children: null
        },
        {
          id: 4,
          name: 'Four',
          children: null
        }
      ];
      var diff = treeDiff(oldData, newData);
      expect(diff).to.deep.equal({
        cmds: [
          {
            op: 'insert',
            index: 0,
            parentId: null,
            node: {
              id: 0,
              name: 'Zero',
              children: null
            }
          },
          {
            op: 'set-property',
            id: 4,
            property: 'name',
            value: 'Four'
          }
        ],
        equal: false
      });
    });
  });

  describe('removing one node', function() {
    it('should be detected', function() {
      var oldData = [
        {
          id: 0,
          name: 'Zero',
          children: null
        },
        {
          id: 4,
          name: '4',
          children: null
        }
      ];
      var newData = [
        {
          id: 4,
          name: 'Four',
          children: null
        }
      ];
      var diff = treeDiff(oldData, newData);
      expect(diff).to.deep.equal({
        cmds: [
          {
            op: 'remove',
            id: 0,
          },
          {
            op: 'set-property',
            id: 4,
            property: 'name',
            value: 'Four'
          }
        ],
        equal: false
      });
    });
  });

  describe('swapping nodes', function() {
    it('should be detected', function() {
      var oldData = [
        {
          id: 0,
          name: '0',
          children: null
        },
        {
          id: 4,
          name: '4',
          children: null
        }
      ];
      var newData = [
        {
          id: 4,
          name: 'Four',
          children: null
        },
        {
          id: 0,
          name: 'Zero',
          children: null
        }
      ];
      var diff = treeDiff(oldData, newData);
      expect(diff).to.deep.equal({
        cmds: [
          {
            op: 'move',
            id: 0,
            index: 1,
            parentId: null
          },
          {
            op: 'set-property',
            id: 0,
            property: 'name',
            value: 'Zero'
          },
          {
            op: 'set-property',
            id: 4,
            property: 'name',
            value: 'Four'
          }
        ],
        equal: false
      });
    });
  });

  describe('moving item', function() {
    it('should sort command to prevent id conflict', function() {
      var oldData = [
        {
          id: 0,
          name: '0',
          isPrefab: false,
          isActive: true,
          children: null
        },
        {
          id: 1,
          name: '1',
          isPrefab: false,
          isActive: true,
          children: null
        },
        {
          id: 2,
          name: '2',
          isPrefab: false,
          isActive: true,
          children: null
        }
      ];
      var newData = [
        {
          id: 2,
          name: '2',
          isPrefab: false,
          isActive: true,
          children: null
        },
        {
          id: 0,
          name: '0',
          isPrefab: false,
          isActive: true,
          children: null
        },
        {
          id: 1,
          name: '1',
          isPrefab: false,
          isActive: true,
          children: null
        }
      ];
      var diff = treeDiff(oldData, newData);
      expect(diff).to.deep.equal({
        cmds: [
          {
            op: 'remove',
            id: 2
          },
          {
            op: 'insert',
            parentId: null,
            index: 0,
            node: {
              id: 2,
              name: '2',
              children: null,
              isPrefab: false,
              isActive: true,
            }
          },
        ],
        equal: false
      });
    });
    it('should sort command if in children', function() {
      var oldData = [
        {
          id: 0,
          name: '0',
          isPrefab: false,
          isActive: true,
          children: null
        },
        {
          id: 1,
          name: '1',
          isPrefab: false,
          isActive: true,
          children: null
        },
        {
          id: 2,
          name: '2',
          isPrefab: false,
          isActive: true,
          children: null
        }
      ];
      var newData = [
        {
          id: 2,
          name: '2',
          isPrefab: false,
          isActive: true,
          children: null
        },
        {
          id: 0,
          name: '0',
          isPrefab: false,
          isActive: true,
          children: null
        },
        {
          id: 1,
          name: '1',
          isPrefab: false,
          isActive: true,
          children: null
        }
      ];
      var diff = treeDiff(oldData, newData);
      expect(diff).to.deep.equal({
        cmds: [
          {
            op: 'remove',
            id: 2
          },
          {
            op: 'insert',
            parentId: null,
            index: 0,
            node: {
              id: 2,
              name: '2',
              isPrefab: false,
              isActive: true,
              children: null
            }
          }
        ],
        equal: false
      });
    });

    it('should sort command if in deep children', function() {
      var oldData = [
        {
          id: 0,
          name: '0',
          isPrefab: false,
          isActive: true,
          children: [
            {
              id: 1,
              name: '1',
              isPrefab: false,
              isActive: true,
              children: [
                {
                   id: 2,
                   name: '2',
                   isPrefab: false,
                   isActive: true,
                   children: null
                }
              ]
            }
          ]
        }
      ];
      var newData = [
        {
          id: 0,
          name: '0',
          isPrefab: false,
          isActive: true,
          children: [
            {
              id: 2,
              name: '2',
              isPrefab: false,
              isActive: true,
              children: [
                {
                  id: 1,
                  name: '1',
                  isPrefab: false,
                  isActive: true,
                  children: null
                }
              ]
            }
          ]
        }
      ];
      var diff = treeDiff(oldData, newData);
      expect(diff).to.deep.equal({
        cmds: [
          {
            op: 'remove',
            id: 1
          },
          {
            op: 'insert',
            parentId: 0,
            index: 0,
            node: {
              id: 2,
              name: '2',
              isPrefab: false,
              isActive: true,
              children: [
                {
                  id: 1,
                  name: '1',
                  children: null,
                  isPrefab: false,
                  isActive: true,
                }
              ]
            }
          }
        ],
        equal: false
      });
    });

    it.skip('should use "append" if insert to the end', function() {
      var oldData = [
        {
          id: 0,
          name: '0',
          children: null,
        },
        {
          id: 1,
          name: '1',
          children: null,
        },
        {
          id: 2,
          name: '2',
          children: null,
        },
        {
          id: 3,
          name: '3',
          children: null,
        }
      ];
      var newData = [
        {
          id: 0,
          name: '0',
          children: [
            {
              id: 1,
              name: '1',
              children: null,
            },
            {
              id: 2,
              name: '2',
              children: null,
            },
          ]
        },
        {
          id: 3,
          name: '3',
          children: null,
        }
      ];
      var diff = treeDiff(oldData, newData);
      expect(diff).to.deep.equal({
        cmds: [
          { op: 'remove', id: 1 },
          { op: 'remove', id: 2 },
          { op: 'remove', id: 3 },
          { op: 'append',
            parentId: 0,
            node: {
              id: 1,
              name: '1',
              children: null,
              isPrefab: false,
              isActive: true,
            }
          },
          { op: 'append',
            parentId: 0,
            node: {
              id: 2,
              name: '2',
              children: null,
              isPrefab: false,
              isActive: true,
            }
          },
          { op: 'append',
            parentId: null,
            node: {
              id: 3,
              name: '3',
              children: null,
              isPrefab: false,
              isActive: true,
            }
          }
        ],
        equal: false
      });
    });

    it.skip('should use "append" if insert at the end', function() {
      var oldData = [
        {
          id: 0,
          name: '0',
          children: null,
        },
        {
          id: 1,
          name: '1',
          children: null,
        },
        {
          id: 2,
          name: '2',
          children: null,
        },
        {
          id: 3,
          name: '3',
          children: null,
        }
      ];
      var newData = [
        {
          id: 2,
          name: '2',
          children: [
            {
              id: 0,
              name: '0',
              children: null,
            },
            {
              id: 1,
              name: '1',
              children: null,
            },
          ]
        },
        {
          id: 3,
          name: '3',
          children: null,
        }
      ];
      var diff = treeDiff(oldData, newData);
      expect(diff).to.deep.equal({
        cmds: [
          { op: 'remove', id: 0 },
          { op: 'remove', id: 1 },
          { op: 'remove', id: 2 },
          { op: 'remove', id: 3 },
          { op: 'append',
            parentId: null,
            node: {
              id: 2, name: '2', children: [
                {
                  id: 0,
                  name: '0',
                  isPrefab: false,
                  isActive: true,
                  children: null,
                },
                {
                  id: 1,
                  name: '1',
                  isPrefab: false,
                  isActive: true,
                  children: null,
                },
              ]
            }
          },
          { op: 'append',
            parentId: null,
            node: {
              id: 3,
              name: '3',
              isPrefab: false,
              isActive: true,
              children: null
            }
          },
        ],
        equal: false
      });
    });
  });
});
