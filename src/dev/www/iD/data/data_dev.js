iD.data = {
    load: function(path, callback) {
        if (!callback) {
            callback = path;
            path = '';
        }
        iD.util.asyncMap([
            path + '/iD/data/deprecated.json',
            path + '/iD/data/discarded.json',
            path + '/iD/data/imagery.json',
            path + '/iD/data/wikipedia.json',
            path + '/iD/data/presets/presets.json',
            path + '/iD/data/presets/defaults.json',
            path + '/iD/data/presets/categories.json',
            path + '/iD/data/presets/fields.json',
            path + '/iD/data/imperial.json',
            path + '/iD/data/feature-icons.json',
            path + '/iD/data/operations-sprite.json',
            path + '/iD/data/locales.json',
            path + '/iD/dist/locales/en.json',
            path + '/iD/data/name-suggestions.json'
            ], d3.json, function (err, data) {

            iD.data = {
                deprecated: data[0],
                discarded: data[1],
                imagery: data[2],
                wikipedia: data[3],
                presets: {
                    presets: data[4],
                    defaults: data[5],
                    categories: data[6],
                    fields: data[7]
                },
                imperial: data[8],
                featureIcons: data[9],
                operations: data[10],
                locales: data[11],
                en: data[12],
                suggestions: data[13]
            };

            callback();
        });
    }
};
