// Run this with: node generate-postman.js
const fs = require('fs');

const collection = {
  info: {
    name: "Video Platform Backend - Complete Testing",
    description: "End-to-end API testing for Video Platform",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    { key: "base_url", value: "http://localhost:5000/api/v1" },
    { key: "token", value: "" },
    { key: "videoId", value: "" },
    { key: "commentId", value: "" },
    { key: "planId", value: "" },
    { key: "creatorId", value: "" },
    { key: "notificationId", value: "" },
    { key: "userId", value: "" }
  ],
  item: [
    {
      name: "01 - Health Check",
      item: [
        {
          name: "Health Check",
          request: {
            method: "GET",
            header: [],
            url: { raw: "{{base_url}}/health" }
          }
        }
      ]
    },
    {
      name: "02 - Authentication",
      item: [
        {
          name: "Register Viewer",
          event: [{
            listen: "test",
            script: {
              exec: [
                "if (pm.response.code === 201) {",
                "    const res = pm.response.json();",
                "    pm.environment.set('token', res.data.accessToken);",
                "    pm.environment.set('userId', res.data.user._id);",
                "}"
              ]
            }
          }],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Test Viewer",
                email: "viewer@test.com",
                password: "Password123!",
                role: "viewer"
              }, null, 2)
            },
            url: { raw: "{{base_url}}/users/register" }
          }
        },
        {
          name: "Register Creator",
          event: [{
            listen: "test",
            script: {
              exec: [
                "if (pm.response.code === 201) {",
                "    const res = pm.response.json();",
                "    pm.environment.set('creatorId', res.data.user._id);",
                "}"
              ]
            }
          }],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Test Creator",
                email: "creator@test.com",
                password: "Password123!",
                role: "creator"
              }, null, 2)
            },
            url: { raw: "{{base_url}}/users/register" }
          }
        },
        {
          name: "Register Admin",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Admin User",
                email: "admin@test.com",
                password: "Password123!",
                role: "admin"
              }, null, 2)
            },
            url: { raw: "{{base_url}}/users/register" }
          }
        },
        {
          name: "Login Creator",
          event: [{
            listen: "test",
            script: {
              exec: [
                "if (pm.response.code === 200) {",
                "    const res = pm.response.json();",
                "    pm.environment.set('token', res.data.accessToken);",
                "}"
              ]
            }
          }],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "creator@test.com",
                password: "Password123!"
              }, null, 2)
            },
            url: { raw: "{{base_url}}/users/login" }
          }
        },
        {
          name: "Get Current User",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/users/me" }
          }
        }
      ]
    }
  ]
};

// Add more folders
const videoFolder = {
  name: "03 - Videos",
  item: [
    {
      name: "Publish Video",
      event: [{
        listen: "test",
        script: {
          exec: [
            "if (pm.response.code === 201) {",
            "    pm.environment.set('videoId', pm.response.json().data._id);",
            "}"
          ]
        }
      }],
      request: {
        method: "POST",
        header: [
          { key: "Authorization", value: "Bearer {{token}}" },
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            title: "My First Video",
            description: "This is a test video about coding tutorials",
            videoUrl: "https://example.com/video.mp4",
            videoPublicId: "video_123",
            thumbnailUrl: "https://example.com/thumb.jpg",
            thumbnailPublicId: "thumb_123",
            category: "Technology",
            tags: ["coding", "tutorial"]
          }, null, 2)
        },
        url: { raw: "{{base_url}}/videos" }
      }
    },
    {
      name: "Get All Videos",
      request: {
        method: "GET",
        header: [],
        url: { raw: "{{base_url}}/videos?limit=10" }
      }
    },
    {
      name: "Get Single Video",
      request: {
        method: "GET",
        header: [],
        url: { raw: "{{base_url}}/videos/{{videoId}}" }
      }
    },
    {
      name: "Get Trending Videos",
      request: {
        method: "GET",
        header: [],
        url: { raw: "{{base_url}}/videos/trending" }
      }
    },
    {
      name: "Get Recommended Videos",
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/videos/recommended" }
      }
    },
    {
      name: "Update Video",
      request: {
        method: "PATCH",
        header: [
          { key: "Authorization", value: "Bearer {{token}}" },
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            title: "Updated Video Title",
            description: "Updated description"
          }, null, 2)
        },
        url: { raw: "{{base_url}}/videos/{{videoId}}" }
      }
    },
    {
      name: "Toggle Publish Status",
      request: {
        method: "PATCH",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/videos/{{videoId}}/toggle" }
      }
    },
    {
      name: "Delete Video",
      request: {
        method: "DELETE",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/videos/{{videoId}}" }
      }
    }
  ]
};

collection.item.push(videoFolder);

// Comments
collection.item.push({
  name: "04 - Comments",
  item: [
    {
      name: "Add Comment",
      event: [{
        listen: "test",
        script: {
          exec: [
            "if (pm.response.code === 201) {",
            "    pm.environment.set('commentId', pm.response.json().data._id);",
            "}"
          ]
        }
      }],
      request: {
        method: "POST",
        header: [
          { key: "Authorization", value: "Bearer {{token}}" },
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({ content: "Great video! Very helpful." }, null, 2)
        },
        url: { raw: "{{base_url}}/comments/video/{{videoId}}" }
      }
    },
    {
      name: "Reply to Comment",
      request: {
        method: "POST",
        header: [
          { key: "Authorization", value: "Bearer {{token}}" },
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            content: "Thanks for watching!",
            parentCommentId: "{{commentId}}"
          }, null, 2)
        },
        url: { raw: "{{base_url}}/comments/video/{{videoId}}" }
      }
    },
    {
      name: "Get Video Comments",
      request: {
        method: "GET",
        header: [],
        url: { raw: "{{base_url}}/comments/video/{{videoId}}?limit=10" }
      }
    },
    {
      name: "Update Comment",
      request: {
        method: "PATCH",
        header: [
          { key: "Authorization", value: "Bearer {{token}}" },
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({ content: "Updated comment text" }, null, 2)
        },
        url: { raw: "{{base_url}}/comments/{{commentId}}" }
      }
    },
    {
      name: "Delete Comment",
      request: {
        method: "DELETE",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/comments/{{commentId}}" }
      }
    }
  ]
});

// Likes
collection.item.push({
  name: "05 - Likes",
  item: [
    {
      name: "Toggle Video Like",
      request: {
        method: "POST",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/likes/video/{{videoId}}" }
      }
    },
    {
      name: "Toggle Comment Like",
      request: {
        method: "POST",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/likes/comment/{{commentId}}" }
      }
    },
    {
      name: "Get Liked Videos",
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/likes/videos" }
      }
    }
  ]
});

// Watch History
collection.item.push({
  name: "06 - Watch History",
  item: [
    {
      name: "Track Watch",
      request: {
        method: "POST",
        header: [
          { key: "Authorization", value: "Bearer {{token}}" },
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            videoId: "{{videoId}}",
            watchDuration: 120
          }, null, 2)
        },
        url: { raw: "{{base_url}}/watch-history/track" }
      }
    },
    {
      name: "Get Watch History",
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/watch-history" }
      }
    },
    {
      name: "Resume Playback",
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/watch-history/resume/{{videoId}}" }
      }
    },
    {
      name: "Delete Watch History Entry",
      request: {
        method: "DELETE",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/watch-history/{{videoId}}" }
      }
    },
    {
      name: "Clear All Watch History",
      request: {
        method: "DELETE",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/watch-history/clear" }
      }
    }
  ]
});

// Plans
collection.item.push({
  name: "07 - Plans (Admin)",
  item: [
    {
      name: "Create Plan - Free",
      event: [{
        listen: "test",
        script: {
          exec: [
            "if (pm.response.code === 201) {",
            "    pm.environment.set('planId', pm.response.json().data._id);",
            "}"
          ]
        }
      }],
      request: {
        method: "POST",
        header: [
          { key: "Authorization", value: "Bearer {{token}}" },
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            name: "Free",
            price: 0,
            features: {
              uploadLimit: 5,
              analyticsAccess: false,
              adFree: false,
              aiTools: false
            }
          }, null, 2)
        },
        url: { raw: "{{base_url}}/plans" }
      }
    },
    {
      name: "Create Plan - Pro",
      request: {
        method: "POST",
        header: [
          { key: "Authorization", value: "Bearer {{token}}" },
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            name: "Pro",
            price: 9.99,
            features: {
              uploadLimit: 100,
              analyticsAccess: true,
              adFree: true,
              aiTools: true
            }
          }, null, 2)
        },
        url: { raw: "{{base_url}}/plans" }
      }
    },
    {
      name: "Get All Plans",
      request: {
        method: "GET",
        header: [],
        url: { raw: "{{base_url}}/plans" }
      }
    }
  ]
});

// Subscriptions
collection.item.push({
  name: "08 - Subscriptions",
  item: [
    {
      name: "Subscribe to Plan",
      request: {
        method: "POST",
        header: [
          { key: "Authorization", value: "Bearer {{token}}" },
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            planId: "{{planId}}",
            userId: "{{userId}}"
          }, null, 2)
        },
        url: { raw: "{{base_url}}/subscriptions/subscribe" }
      }
    }
  ]
});

// AI
collection.item.push({
  name: "09 - AI Features",
  item: [
    {
      name: "Generate Title Suggestions",
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            description: "This video teaches beginners how to build a REST API using Node.js and Express"
          }, null, 2)
        },
        url: { raw: "{{base_url}}/ai/generate-title" }
      }
    }
  ]
});

// Creator Subscriptions
collection.item.push({
  name: "10 - Creator Subscriptions",
  item: [
    {
      name: "Subscribe to Creator",
      request: {
        method: "POST",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/creators/{{creatorId}}/subscribe" }
      }
    },
    {
      name: "Get Creator Subscribers",
      request: {
        method: "GET",
        header: [],
        url: { raw: "{{base_url}}/creators/{{creatorId}}/subscribers" }
      }
    }
  ]
});

// Dashboard
collection.item.push({
  name: "11 - Dashboard (Creator)",
  item: [
    {
      name: "Get Analytics",
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/dashboard/analytics" }
      }
    },
    {
      name: "Get Video Stats",
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/dashboard/video-stats" }
      }
    }
  ]
});

// Notifications
collection.item.push({
  name: "12 - Notifications",
  item: [
    {
      name: "Get Notifications",
      event: [{
        listen: "test",
        script: {
          exec: [
            "if (pm.response.code === 200) {",
            "    const res = pm.response.json();",
            "    if (res.data && res.data.length > 0) {",
            "        pm.environment.set('notificationId', res.data[0]._id);",
            "    }",
            "}"
          ]
        }
      }],
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/notifications" }
      }
    },
    {
      name: "Get Unread Count",
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/notifications/unread-count" }
      }
    },
    {
      name: "Mark Notification as Read",
      request: {
        method: "PATCH",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/notifications/{{notificationId}}/read" }
      }
    },
    {
      name: "Mark All as Read",
      request: {
        method: "PATCH",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/notifications/read-all" }
      }
    }
  ]
});

// User Management
collection.item.push({
  name: "13 - User Management",
  item: [
    {
      name: "Get All Users (Admin)",
      request: {
        method: "GET",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/users" }
      }
    },
    {
      name: "Update Profile",
      request: {
        method: "PATCH",
        header: [
          { key: "Authorization", value: "Bearer {{token}}" },
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({ name: "Updated Name" }, null, 2)
        },
        url: { raw: "{{base_url}}/users/update" }
      }
    },
    {
      name: "Change Password",
      request: {
        method: "PATCH",
        header: [
          { key: "Authorization", value: "Bearer {{token}}" },
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            oldPassword: "Password123!",
            newPassword: "NewPassword123!"
          }, null, 2)
        },
        url: { raw: "{{base_url}}/users/change-password" }
      }
    },
    {
      name: "Block/Unblock User (Admin)",
      request: {
        method: "PATCH",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/users/block/{{userId}}" }
      }
    },
    {
      name: "Delete Account",
      request: {
        method: "DELETE",
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
        url: { raw: "{{base_url}}/users/delete" }
      }
    }
  ]
});

// Write to file
fs.writeFileSync(
  'Video_Platform_Postman_Collection.json',
  JSON.stringify(collection, null, 2)
);

console.log('✅ Postman collection generated: Video_Platform_Postman_Collection.json');
console.log('📝 Import this file into Postman to start testing');
console.log('');
console.log('📋 Collection includes:');
console.log('   ✓ 01 - Health Check (1 request)');
console.log('   ✓ 02 - Authentication (5 requests)');
console.log('   ✓ 03 - Videos (8 requests)');
console.log('   ✓ 04 - Comments (5 requests)');
console.log('   ✓ 05 - Likes (3 requests)');
console.log('   ✓ 06 - Watch History (5 requests)');
console.log('   ✓ 07 - Plans (3 requests)');
console.log('   ✓ 08 - Subscriptions (1 request)');
console.log('   ✓ 09 - AI Features (1 request)');
console.log('   ✓ 10 - Creator Subscriptions (2 requests)');
console.log('   ✓ 11 - Dashboard (2 requests)');
console.log('   ✓ 12 - Notifications (4 requests)');
console.log('   ✓ 13 - User Management (5 requests)');
console.log('');
console.log('📊 Total: 45 API endpoints ready to test');
console.log('');
console.log('🚀 Next steps:');
console.log('   1. Start your backend: npm run dev');
console.log('   2. Import the collection into Postman');
console.log('   3. Create a Postman environment with base_url variable');
console.log('   4. Run requests in order (tokens auto-save)');
