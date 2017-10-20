module.exports = function(RED) {

    var mqttregex = require('mqtt-regex');

    function findMapping(key, value, mapping) {
        var ret = value;
        //console.log("one: " + key);

        var mapelem = mapping[key];
        if (mapelem) {
            //console.log("mapping found: " + JSON.stringify(mapelem));
            //console.log("mapping this: " + value);
            if (mapelem.hasOwnProperty(value)) {
                ret = mapelem[value];
                //console.log("  to this: " + ret);
            }
        } else {
            //console.log("no mapping found");
        }
        //console.log(JSON.stringify(ret));
        return ret;
    }

    function TopicMapping(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.pattern = config.pattern;
        this.mapname = config.mapname;

        // loading mapping file
        this.mapfilename = config.mapfile;
        if (!this.mapfilename ) {
            node.error("Missing mapfile in config");
        }

        // load the mapping
        this.mapping = require(this.mapfilename);
        if (!this.mapping ) {
            node.error("Cannot load mapfile " + this.mapfilename);
        }
        if (!this.mapname ) {
            node.error("Missing mapname in config");
        }
        this.mapping = this.mapping[this.mapname];

        node.on('input', function(msg) {
            var topic_out = [];
            this.status({fill:"red",shape:"ring",text:msg.topic + " processed"});

            node.debug("topic: " + msg.topic);
            // create a parser from "pattern"
            var topic_parser = mqttregex(this.pattern).exec;

            // parse the incoming topic
            var topic_items = topic_parser(msg.topic);
            node.debug("topic_items: " + JSON.stringify(topic_items));

            for (var key in topic_items) {
                var topic_item = topic_items[key];
                if (Array.isArray(topic_item)) {
                    // multiple topic elements
                    topic_item = topic_item.join("/");
                }
                // single topic element
                var newtop = findMapping(key, topic_item, this.mapping);
                topic_out.push(newtop);
                node.debug(key + ": " + topic_item + " --> " + newtop);
            };
            //msg.items = topic_items;
            msg.mapname = this.mapname;
            msg.mapfile = this.mapfilename;
            var orig_topic = msg.topic;
            msg.topic = topic_out.join("/");
            var flat = {
                "topic": orig_topic,
                "varname": msg.topic.replace(/\//g, "_").toLowerCase(),
                "payload": msg.payload,
                "ts": new Date().getTime()
            };
            node.send([msg,flat]);
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