import {app, AppSettings} from "./app/appSettings";


app.listen(AppSettings.PORT, () => {
    console.log(`Example app listening on port ${AppSettings.PORT}`)
})