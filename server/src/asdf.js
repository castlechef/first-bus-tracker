function errorMe() {
    throw Error("asdf");
}

try {

    errorMe();
} catch(e) {
    console.log('caught' + e);
}
