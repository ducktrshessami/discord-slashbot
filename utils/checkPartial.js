async function checkPartial(obj) {
    return obj.partial ? await obj.fetch() : obj;
}

module.exports = checkPartial;
