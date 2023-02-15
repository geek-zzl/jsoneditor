// {% load static %}
var name = '{{data.name|safe}}'

console.log(name)
let nodesData = [];
let linksData;
let linkDistance = 50;

function loadData() {
    return new Promise(function (resolve, reject) {
        d3.json("/static/data/graph-e.json", function (error, graph) {
        // d3.json("{%static 'data/graph.json'%}", function (error, graph) {
            if (error) {
                reject(error);
            } else {
                resolve(graph);
            }
        });
    });
}

loadData().then(function (graph) {
    // Do something with graph here
    //nodesData = graph.nodes;
    linksData = graph.links;

    // var node_num = 0
    graph.nodes.forEach(function (node) {
        // console.log(typeof node)
        // console.log(node.id)
        nodesData[node.id] = {id: node.id};
        nodesData.length ++;
    })
    // nodesData.length = node_num

    console.log(nodesData)
    console.log(Array.isArray(nodesData));
    console.log(linksData)
    // console.log("开始分类")

//Compute the distinct nodes from the links. 通过出入连接的 但是是一个无向图 没箭头
    linksData.forEach(function (link) {
        // console.log("新")
        // console.log(link.source)
        //console.log(nodesData[0].id)
        // console.log(nodesData[link.source].id)
        //对象也变了 str转object
        link.source = nodesData[link.source] || (nodesData[link.source] = {id: link.source});
        link.target = nodesData[link.target] || (nodesData[link.target] = {id: link.target});
        // console.log(link.source)
    });

    console.log(linksData.length)
    if (linksData.length > 100)
        linkDistance = 200;
    else if (linksData.length > 80)
        linkDistance = 100;
    else if(linksData.length >20)
        linksData = 80;
    else
        linkDistance = 50;

// console.log(nodes['G2'].id)
// console.log('node = \n') print
//     console.log("================")
//     console.log(linksData)
    // console.log(nodesData)
    // console.log("================")
// links.id.id

    let width = 400,
        height = 600;

//画出图像来
    let force = d3.layout.force()
        .nodes(d3.values(nodesData))
        .links(linksData)
        .size([width, height])
        .linkDistance(linkDistance)
        .charge(-300)
        .on("tick", tick)
        .start();

    // console.log("========画完了========")
    let svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

// Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
        .enter().append("marker")
        .attr("id", function (d) {
            return d;
        })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    let path = svg.append("g").selectAll("path")
        .data(force.links())
        .enter().append("path")
        .attr("class", function (d) {
            return "link " + d.type;
        })
        .attr("marker-end", function (d) {
            return "url(#" + d.type + ")";
        });

    let circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
        .enter().append("circle")
        .attr("r", 6)
        .call(force.drag);


    let text = svg.append("g").selectAll("text")
        .data(force.nodes())
        .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function (d) {
            return d.id;
        });//名字

// Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
        path.attr("d", linkArc);
        circle.attr("transform", transform);
        text.attr("transform", transform);
    }

    function linkArc(d) {
        let dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }
});