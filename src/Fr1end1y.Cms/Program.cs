using Fr1end1y.Cms.Extensions;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.CreateUmbracoBuilder()
		.AddBackOffice()
		.AddWebsite()
		.AddComposers()
		.Build();

WebApplication app = builder.Build();

app.UseEleventy();

await app.BootUmbracoAsync();


app.UseUmbraco()
		.WithMiddleware(u =>
		{
			u.UseBackOffice();
			u.UseWebsite();
		})
		.WithEndpoints(u =>
		{
			u.UseBackOfficeEndpoints();
			u.UseWebsiteEndpoints();
		});

await app.RunAsync();
