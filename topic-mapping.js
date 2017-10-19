module.exports = function(RED) {

    var mqttregex = require('mqtt-regex');

    function TopicMapping(config) {
        RED.nodes.createNode(this,config);
        this.pattern = config.pattern;
        this.mapfilename = config.mapfile;
        var node = this;
        var mapping = require(this.mapfilename);

        node.on('input', function(msg) {
            this.status({fill:"red",shape:"ring",text:msg.topic + " processed"});

            var room_message_info = mqttregex(this.pattern).exec;
            var topic = msg.topic;
            var message_content = msg.payload;
            var params = room_message_info(topic);
            msg.items = params;
            msg.mapping = mapping;
            node.send(msg);
        });
    }
    RED.nodes.registerType("topic-mapping",TopicMapping);

    function MatsNodeOut(config) {
        RED.nodes.createNode(this,config);
        this.test = config.test;
        var node = this;
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase() + this.test;
            this.status({fill:"green",shape:"ring",text:this.test + " added"});
            node.send(msg);
        });
    }
    RED.nodes.registerType("mats out",MatsNodeOut);
}