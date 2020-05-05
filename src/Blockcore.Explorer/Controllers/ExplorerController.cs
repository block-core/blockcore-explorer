using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace Blockcore.Explorer.Controllers
{
   [ApiController]
   [Route("api/explorer")]
   public class ExplorerController
   {
      private readonly IConfiguration configuration;

      public ExplorerController(IConfiguration configuration)
      {
         this.configuration = configuration;
      }

      [HttpGet]
      [Route("chain")]
      public IActionResult Network()
      {
         string chain = configuration["chain"];

         return new OkObjectResult(chain);
      }
   }
}
