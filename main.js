var plurk_oauth = require('./lib/plurk_oauth')
var conf = require('./lib/key')
var api_root_uri = 'https://www.plurk.com'
var users = {}
var plurks = []

var dumpData = function (err, data) {
    if (err) {
        console.log(err)
        console.log('Obtain plurk error! Exit process.')
        process.exit(1)
    }
    data = JSON.parse(data)
    data['plurks'].forEach((p) => {
        for (var id in users) {
            if (
                id == p['owner_id'] &&
                plurks.includes(p['plurk_id']) == false
            ) {
                plurks.push(p['plurk_id'])
                var dateString = new Date(Date.now()).toUTCString()
                console.log(dateString + '  ' + users[id] + ' 發新噗囉!')
                console.log(
                    'https://www.plurk.com/p/' +
                        parseInt(p['plurk_id'], 10).toString(36)
                )
                browser.notifications.create({
                    type: 'basic',
                    title: users[id] + ' 發新噗囉!',
                    message:
                        'https://www.plurk.com/p/' +
                        parseInt(p['plurk_id'], 10).toString(36),
                })
            }
        }
    })
    while (plurks.length > 20) {
        plurks.splice(0, plurks.length - 20)
    }
}

var parseUser = function (err, data) {
    if (err) {
        console.log(err)
        console.log('Obtain user error! Exit process.')
        process.exit(1)
    } else {
        data = JSON.parse(data)
        users[data['user_info']['id']] = data['user_info']['display_name']
    }
}

var main = function () {
    conf.id.forEach((id) => {
        plurk_oauth.callAPI(
            api_root_uri + '/APP/Profile/getPublicProfile',
            { user_id: id },
            parseUser
        )
    })
    setInterval(function () {
        plurk_oauth.callAPI(
            api_root_uri + '/APP/Polling/getPlurks',
            { offset: '2009-6-20T21:55:34' },
            dumpData
        )
    }, 3000)
}

main()
