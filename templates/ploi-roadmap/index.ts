import {
  Output,
  randomPassword,
  randomString,
  Services,
} from "~templates-utils";
import { Input } from "./meta";

export function generate(input: Input): Output {
  const services: Services = [];
  const mariaPassword = randomPassword();
  const appKey = Buffer.from(randomString(32)).toString("base64");

  services.push({
    type: "app",
    data: {
      projectName: input.projectName,
      serviceName: input.appServiceName,
      env: [
        `APP_ENV=production`,
        `APP_NAME=Ploi Roadmap`,
        `APP_KEY=base64:${appKey}`,
        `APP_ENV=local`,
        `APP_ADMIN_NOTIFICATIONS=${input.adminNotifications}`,
        `APP_LOCALE=${input.appLanguage}`,
        `APP_TIMEZONE=${input.appTimezone}`,
        `DB_CONNECTION=mysql`,
        `DB_HOST=${input.projectName}_${input.databaseServiceName}`,
        `DB_POST=3306`,
        `DB_DATABASE=${input.projectName}`,
        `DB_USERNAME=mariadb`,
        `DB_PASSWORD=${mariaPassword}`,
      ].join("\n"),
      source: {
        type: "image",
        image: input.appServiceImage,
      },
      proxy: {
        port: 80,
        secure: true,
      },
      mounts: [
        {
          type: "volume",
          name: "vendor",
          mountPath: "/vendor",
        },
        {
          type: "volume",
          name: "app-data",
          mountPath: "/app",
        },
      ],
    },
  });

  services.push({
    type: "mariadb",
    data: {
      projectName: input.projectName,
      serviceName: input.databaseServiceName,
      password: mariaPassword,
    },
  });

  return { services };
}
