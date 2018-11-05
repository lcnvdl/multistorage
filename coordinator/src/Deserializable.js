class Deserializable {
    serialize() {
        return JSON.stringify(this.serializeToDictionary());
    }

    serializeToDictionary() {
        return Object.assign({}, this);
    }

    deserialize(data) {
        let types = {};

        for(let key in this) {
            let v = this[key];
            if(v instanceof Date) {
                types[key] = "date";
            }
            else {
                types[key] = typeof v;
            }
        }

        Object.assign(this, data);

        for(let key in types) {
            let t = types[key];
            let v = this[key];

            if(t === "date") {
                this[key] = new Date(v);
            }
            else if(t === "number") {
                this[key] = +v;
            }
        }
    }
}

module.exports = Deserializable;