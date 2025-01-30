using Microsoft.Extensions.Options;
using System.Diagnostics;

using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;
using uSync.BackOffice.Services;

using Fr1end1y.Cms.Configuration;

namespace Fr1end1y.Cms.Notifications;

// Notification handler to run an Eleventy build when content is published
// https://docs.umbraco.com/umbraco-cms/reference/notifications/notification-handler
public class ContentPublishedNotificationHandler : INotificationAsyncHandler<ContentPublishedNotification>
{
	private readonly IWebHostEnvironment _webHostEnvironment;
	private readonly ILogger<ContentPublishedNotificationHandler> _logger;
	private readonly ISyncEventService _uSyncEventService;
	private readonly Fr1end1yOptions _options;

	public ContentPublishedNotificationHandler(
		IWebHostEnvironment webHostEnvironment,
		ILogger<ContentPublishedNotificationHandler> logger,
		ISyncEventService uSyncEventService,
		IOptions<Fr1end1yOptions> options)
	{
		_webHostEnvironment = webHostEnvironment;
		_logger = logger;
		_uSyncEventService = uSyncEventService;
		_options = options.Value;
	}

	public async Task HandleAsync(
		ContentPublishedNotification notification,
		CancellationToken cancellationToken)
	{
		if (!_options.BuildEleventySite)
		{
			return;
		}

		// Don't trigger build when notification was fired by uSync
		// https://docs.jumoo.co.uk/usync/uSync/extending/detecting#detecting-via-notification-state-usync-v131
		if (_uSyncEventService.IsPaused)
		{
			return;
		}

		var contentRootPath = _webHostEnvironment.ContentRootPath;
		var eleventyRootDir = Path.Combine(contentRootPath, _options.EleventyRootDir);
		await RunEleventyBuild(eleventyRootDir, cancellationToken);
	}

	private async Task RunEleventyBuild(string rootDir, CancellationToken cancellationToken)
	{
		_logger.LogInformation("Executing `npm run build` in {rootDir}", rootDir);

		var buildProcess = Process.Start(new ProcessStartInfo
		{
			WorkingDirectory = rootDir,
			FileName = "npm",
			Arguments = "run build-site"
		});

		if (buildProcess == null)
		{
			_logger.LogError("Failed to execute `npm run build` in {rootDir}", rootDir);
			return;
		}

		await buildProcess.WaitForExitAsync(cancellationToken);
	}
}
