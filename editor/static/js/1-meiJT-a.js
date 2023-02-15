// http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/
// links = [{},{},{}]
// var 数组
// var links = [
//     {
//         "origin": "learned",
//         "weight": -1.0534423312927808,
//         "source": "paid",
//         "target": "absences"
//     },
//     {
//         "origin": "learned",
//         "weight": 0.8722860711674669,
//         "source": "studytime",
//         "target": "G1"
//     },
//     {
//         "origin": "learned",
//         "weight": 0.8949618487477984,
//         "source": "higher",
//         "target": "famrel"
//     },
//     {
//         "origin": "learned",
//         "weight": 2.72714690944907,
//         "source": "higher",
//         "target": "G1"
//     },
//     {
//         "origin": "learned",
//         "weight": 1.04007196377878,
//         "source": "address",
//         "target": "absences"
//     },
//     {
//         "origin": "learned",
//         "weight": 0.9395648160771818,
//         "source": "failures",
//         "target": "absences"
//     },
//     {
//         "origin": "unknown",
//         "source": "failures",
//         "target": "G1"
//     },
//     {
//         "origin": "learned",
//         "weight": 0.8871053042645157,
//         "source": "G1",
//         "target": "G2"
//     },
//     {
//         "origin": "learned",
//         "weight": 0.859934111560719,
//         "source": "Pstatus",
//         "target": "famrel"
//     },
//     {
//         "origin": "learned",
//         "weight": -1.0538427584604029,
//         "source": "Pstatus",
//         "target": "absences",
//         type: "resolved"
//     },
//     {
//         "origin": "learned",
//         "weight": 0.8368781062997886,
//         "source": "internet",
//         "target": "absences",
//         type: "licensing"
//     },
//     {
//         origin: "learned",
//         weight: 0.8825132198443957,
//         source: "david",
//         target: "david2",
//         type  : "suit"
//     }
// ];
// var nodes = [
//     {id : "david"},
//     {id : "david2"},
//     {id : "david3"}
// ];
//导入
// var nodes;
// var links;
// // console.log(links[0])
// console.log("in json1")
// //
// d3.json("graph.json", function (error, graph) {
//         if (error) throw error;
//         window.nodes = graph.nodes;
//         window.links = graph.links;
//
//     })

var nodesData = [];
var linksData;

function loadData() {
    return new Promise(function (resolve, reject) {
        d3.json("graph.json", function (error, graph) {
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

    var node_num = 0
    graph.nodes.forEach(function (node) {
        console.log(typeof node)
        console.log(node.id)
        // console.log(node.id)
        // console.log(nodes)
        node_num += 1;

        nodesData[node.id] = {id: node.id};
    })
    nodesData.length = node_num

    console.log(nodesData)
    console.log(linksData)
    console.log("开始分类")

//Compute the distinct nodes from the links. 通过出入连接的 但是是一个无向图 没箭头
    linksData.forEach(function (link) {
        console.log("新")
        console.log(link.source)
        //console.log(nodesData[0].id)
        console.log(nodesData[link.source].id)
        //对象也变了 str转object
        link.source = nodesData[link.source] || (nodesData[link.source] = {id: link.source});
        link.target = nodesData[link.target] || (nodesData[link.target] = {id: link.target});
        console.log(link.source)
    });

// console.log(nodes['G2'].id)
// console.log('node = \n') print
    console.log("================")
    console.log(linksData)
    console.log(nodesData)
    console.log("================")

// links.id.id


    var width = 800,
        height = 600;

//画出图像来
    var force = d3.layout.force()
        .nodes(d3.values(nodesData))
        .links(linksData)
        .size([width, height])
        .linkDistance(60)
        .charge(-300)
        .on("tick", tick)
        .start();

    console.log("========画完了========")
    var svg = d3.select("body").append("svg")
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

    var path = svg.append("g").selectAll("path")
        .data(force.links())
        .enter().append("path")
        .attr("class", function (d) {
            return "link " + d.type;
        })
        .attr("marker-end", function (d) {
            return "url(#" + d.type + ")";
        });

    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
        .enter().append("circle")
        .attr("r", 6)
        .call(force.drag);


    var text = svg.append("g").selectAll("text")
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
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }
});