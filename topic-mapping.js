module.exports = function(RED) {

    var mqttregex = require('mqtt-regex');

    function TopicMapping(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.pattern = config.pattern;

        // loading mapping file
        var mapfilename = config.mapfile;
        node.debug("mapfilename: " + mapfilename);

        // load the mapping
        this.mapping = require(mapfilename);
        node.debug("mapping: " + JSON.stringify(this.mapping));

        node.on('input', function(msg) {
            this.status({fill:"red",shape:"ring",text:msg.topic + " processed"});

            node.debug("topic: " + msg.topic);
            // create a parser from "pattern"
            var topic_parser = mqttregex(this.pattern).exec;

            // parse the incoming topic
            var topic_items = topic_parser(msg.topic);
            node.debug("topic items: " + JSON.stringify(topic_items));

            for (var key in topic_items) {
                if (topic_items.hasOwnProperty(key)) {
                    if (Array.isArray(topic_items[key])) {
                        // multiple topic elements
                        node.debug("many: " + key);
                    } else {
                        // single topic element
                        node.debug("one: " + key);

                        var mapelem = this.mapping[key];
                        node.debug("mapping found: " + JSON.stringify(mapelem));

                        var newelem = mapelem[topic_items[key]];
                        node.debug("new elem: " + JSON.stringify(newelem));


                    }
                }
                // key: the name of the object key
                // index: the ordinal position of the key within the object
            };
            msg.items = topic_items;
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