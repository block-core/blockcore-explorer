using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace Blockcore.Website
{
   public class Program
   {
      public static void Main(string[] args)
      {
         CreateHostBuilder(args).Build().Run();
      }

      public static IHostBuilder CreateHostBuilder(string[] args) =>
          Host.CreateDefaultBuilder(args)
                  .ConfigureAppConfiguration(config =>
                  {
                     config.AddBlockcore("Blockore Explorer", args);
                  })
              .ConfigureWebHostDefaults(webBuilder =>
              {
                 webBuilder.ConfigureKestrel(serverOptions =>
                 {
                    serverOptions.AddServerHeader = false;
                 });

                 webBuilder.UseStartup<Startup>();
              });
   }
}
