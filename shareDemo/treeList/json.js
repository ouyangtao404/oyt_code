{"rootDir": {
    "name": "root",
    "dirList": [
      {
        "name": "baoxian",
        "dirList": [
          {
            "name": "yfx-1",
            "dirList": [{
            	"name":"test",
            	"dirList":[{
            		"name": "test-2",
            		"dirList":[],
		            "entryList":[{
			                "name": "issue-test2",
			                "type": "date",
			                "elementList": [
			                  {
			                    "scope": "default",
			                    "value": "false"
			                  },
			                  {
			                    "scope": "10.10.10.1",
			                    "value": "true"
			                  },
			                  {
			                    "scope": "10.10.10.2",
			                    "value": "false"
			                  },
			                  {
			                    "scope": "10.10.10.3",
			                    "value": "true"
			                  },
			                  {
			                    "scope": "10.10.10.4",
			                    "value": "false"
			                  }
			                ],
		                	"description": "des1"
              			}
              		]
            	}],
            	"entryList":[
	            	{
	            		"name": "issue-entry-2",
		                "type": "number",
		                "elementList": [
		                 {
		                    "scope": "default",
		                    "value": "123321"
		                 },
		                 {
		                    "scope": "10.10.10.2",
		                    "value": "12332221"
		                 },
		                 {
		                    "scope": "10.10.10.3",
		                    "value": "32123321"
		                  }
                  		],
		                "description": "des2"
	            		}
            		]
		          },
		           {
            	"name":"test-2",
            	"dirList":[],
            	"entryList":[
	            	{
	            		"name": "issue-entry",
		                "type": "boolean",
		                "elementList": [
		                 {
		                    "scope": "default",
		                    "value": "true"
		                  }
                  		],
		                "description": "des3"
	            	}
            	]
            }],
            "entryList": [
              {
                "name": "issue-entry2234",
                "type": "boolean",
                "elementList": [
                  {
                    "scope": "default",
                    "value": "true"
                  },
                  {
                    "scope": "10.10.10.3",
                    "value": "false"
                  },
                  {
                    "scope": "10.10.10.2",
                    "value": "false"
                  }
                ],
                "description": "des4"
              },
              {
                "name": "issue-entry22new",
                "type": "boolean",
                "elementList": [
                  {
                    "scope": "default",
                    "value": "true"
                  }
                ],
                "description": "des4"
              }
            ]
          },
          {
            "name": "COD-1",
            "dirList": [],
            "entryList": [
            {
                "name": "issue-COD-2",
                "type": "boolean",
                "elementList": [
                  {
                    "scope": "default",
                    "value": "true"
                  }
                ],
                "description":"des5"
              }
            ]
          }
        ],
        "entryList": [
          {
            "name": "serverId",
            "type": "boolean",
            "elementList": [
              {
                "scope": "default",
                "value": "true"
              },
              {
                "scope": "10.10.10.2",
                "value": "false"
              }, 
              {
                "scope": "10.10.10.3",
                "value": "false"
              }
            ],
            "description": "des6"
          }
        ]
      }
    ],
    "entryList": []
  },
  "ipList": {
    "ipList": [
      "10.10.10.1",
      "10.10.10.2",
      "10.10.10.3",
      "10.10.10.4",
      "10.10.10.5",
      "10.10.10.6"
    ]
  }
}