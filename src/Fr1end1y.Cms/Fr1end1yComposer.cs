using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Notifications;

using Fr1end1y.Cms.Configuration;
using Fr1end1y.Cms.Notifications;

namespace Fr1end1y.Cms;

// Code to run when Umbraco starts
// https://docs.umbraco.com/umbraco-cms/implementation/composing
public class Fr1end1yComposer : IComposer
{
	public void Compose(IUmbracoBuilder builder)
	{
		// Enable the Delivery API
		// https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api
		builder.AddDeliveryApi();

		// Load custom configuration settings for the project using the ASP.NET Core options pattern
		// https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-9.0
		builder.Services.Configure<Fr1end1yOptions>(
			builder.Config.GetSection(Fr1end1yOptions.SectionKey)
		);

		// Add notification handlers
		// https://docs.umbraco.com/umbraco-cms/reference/notifications/notification-handler
		builder.AddNotificationAsyncHandler<ContentPublishedNotification,
			ContentPublishedNotificationHandler>();
	}
}
