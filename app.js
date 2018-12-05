'use strict';

const app = require('fastify')({});
var auth = require('./authentication')

// required plugin for HTTP requests proxy
app.register(require('fastify-reply-from'));

// gateway plugin
app.register(require('k-fastify-gateway'), {
  middlewares: [
    require('cors')(),
    require('helmet')()
  ],

  routes: [

    {
      prefix: '/v1.0/token',
      prefixRewrite: '',
      target: 'https://fda-services-accounts.herokuapp.com',
      middlewares: [],
      hooks: {
        async onRequest(req, res){
          res.send({token: auth.generateToken()})
          return true;
        }
      }
    },
    /**
     * ###########################################################################
     * @description Public Endpoints
     * ###########################################################################
     */
    {
      prefix: '/v1.0/public/accounts',
      prefixRewrite: '',
      target: 'https://fda-services-accounts.herokuapp.com/public',
      middlewares: [],
      hooks: {}
    },
    /**
     * ###########################################################################
     * @description Secured Endpoints
     * ###########################################################################
     */
    {
      prefix: '/v1.0/secured/accounts',
      prefixRewrite: '',
      target: 'https://fda-services-accounts.herokuapp.com/secured',
      middlewares: [],
      hooks: {
        async onRequest(req, res){
          auth.validateSession(req, res, (redirect, response)=>{  
            res = response;          
            return redirect;
          })                   
        }
      }
    },
    
    {
      prefix: "/v1.0/enot-api",
      prefixRewrite: "",
      target: "https://fda-services-cpr-cosmetics.herokuapp.com",
      middlewares: [],
      hooks: {}
    },
    {
      prefix: "/v1.0/cpr-api",
      prefixRewrite: "",
      target: "https://fda-services-cpr-foods.herokuapp.com",
      middlewares: [],
      hooks: {}
    },
    {
      prefix: "/v1.0/lto-api",
      prefixRewrite: "",
      target: "https://fda-services-lto.herokuapp.com",
      middlewares: [],
      hooks: {}
    },
    {
      prefix: "/v1.0/notify-api",
      prefixRewrite: "",
      target: "https://fda-services-notifications.herokuapp.com",
      middlewares: [],
      hooks: {}
    },
    {
      prefix: "/v1.0/payments-api",
      prefixRewrite: "",
      target: "https://fda-services-payments.herokuapp.com",
      middlewares: [],
      hooks: {}
    }
  ]
});

var port = normalizePort(process.env.PORT || "3000");

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// start the gateway HTTP server
app.listen(port, "0.0.0.0").then(address => {
  console.log(`API Gateway listening on ${address}`);
});
