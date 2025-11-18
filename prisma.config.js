require("dotenv/config");
const { defineConfig, env } = require("prisma/config");
module.exports = defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    engine: "classic",
    client: {
        moduleFormat: "commonjs",
    },
    datasource: {
        url: env("DATABASE_URL"),
    },
});
export {};
//# sourceMappingURL=prisma.config.js.map