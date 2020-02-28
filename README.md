# node-red-contrib-topic-mapping

A node-red node that performs mapping of incoming topics into modified outgoing topics.

Uses:
https://github.com/RangerMauve/mqtt-regex

# mapping

A pattern is used to match incoming topics and alter the topic on output. The node has two outputs, one if no mapping is done (to feed another mapper) and a second where mapped messages is sent.
