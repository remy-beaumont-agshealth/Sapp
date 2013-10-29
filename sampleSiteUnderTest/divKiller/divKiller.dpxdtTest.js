module.exports = {
    name : "Main Page: in which the button is clicked",
    url : "index.html",
    config : {
        viewportSize : {
            width : 1024,
            height : 768
        },
        injectCss : ""
    },
    test : function() {
        $('#div-killer').click();
    }
};
