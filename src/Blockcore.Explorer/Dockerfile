FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /app

RUN apt-get update \
    && apt-get install -y curl apt-utils libgdiplus libc6-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . ./
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:3.1

WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 9911
ENTRYPOINT ["dotnet", "Blockcore.Explorer.dll"]
