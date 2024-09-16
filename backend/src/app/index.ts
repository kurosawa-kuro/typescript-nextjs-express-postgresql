import "dotenv/config";
import app from "@/app/app";
import { logger } from "@/app/utils/logger";

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => logger.info(`listening on port ${PORT}`));
