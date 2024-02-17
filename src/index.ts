import {app, AppSettings} from "./app/appSettings";
import {runDb} from "./app/config/db";


app.listen(AppSettings.PORT, async () => {
    await runDb()
})