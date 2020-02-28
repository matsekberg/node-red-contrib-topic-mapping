# node-red-contrib-topic-mapping

A node-red node that performs mapping of incoming topics into modified outgoing topics.

Uses:
https://github.com/RangerMauve/mqtt-regex

# mapping

A pattern is used to match incoming topics and alter the topic on output. The node has two outputs, one if no mapping is done (to feed another mapper) and a second where mapped messages is sent.
The pattern has the same format as any MQTT-topic, with a twist. Whenever a + or a # is found a label is required to tag the MQTT path element for use in later mapping.

A pattern of cmnd/+unit/# will match default tasmota command messages.

A mapping.json file contains the mapping configuration. Several maps can be contained in the file and used be used by the nodes.
