using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

using Fr1end1y.Cms.Configuration;

namespace Fr1end1y.Cms.Extensions;

public static class WebApplicationExtensions
{
	public static IApplicationBuilder UseEleventy(this WebApplication app)
	{
		var options = app.Services.GetService<IOptions<Fr1end1yOptions>>()?.Value;

		// Serve static files from the Eleventy output directory when the
		// `ServeEleventySite` config setting is `true`.
		if (options != null && options.ServeEleventySite)
		{
			// Ensure that Eleventy output directory exists first or
			// `PhysicalFileProvider` will throw an exception.
			var rootPath = Path.Combine(
				app.Environment.ContentRootPath, options.EleventyOutputDir);
			Directory.CreateDirectory(rootPath);

			app.UseFileServer(new FileServerOptions
			{
				FileProvider = new PhysicalFileProvider(rootPath)
			});
		}

		return app;
	}
}
