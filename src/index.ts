import {app, AppSettings} from "./app/appSettings";
import {runDatabase} from "./app/config/db";


app.listen(AppSettings.PORT, async () => {
    await runDatabase()
})