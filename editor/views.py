from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
import json


# def json_editor(request):
#     with open('editor/static/data/graph-e.json', 'r') as f:
#         data = json.load(f)
#         print("graph-e:"+str(data))
#
#     if request.method == 'POST':
#         print("post" + str(data))
#         for key in data:
#             data[key] = request.POST.get(key)
#
#         with open('data-e.json', 'w') as f:
#             f.write(str(data))
#             # json.dump(data, f, indent=4)
#
#     return render(request, 'editor4_two_table_binglie.html', {'data': data})
import json


def new_json_editor(request):
    with open('editor/static/data/graph-e.json', 'r') as f:
        data = json.load(f)

    if request.method == 'POST':
        # 更新nodes
        post_data = json.loads(request.POST.get('json_data'))
        for i, node in enumerate(data['nodes']):
            node_id = post_data['nodes'][i]['id']
            node['id'] = node_id

        # 更新links
        for i, link in enumerate(data['links']):
            source = post_data['links'][i]['source']
            target = post_data['links'][i]['target']
            link['source'] = source
            link['target'] = target

        with open('editor/static/data/graph-e.json', 'w') as f:
            json.dump(data, f, indent=4)

    return render(request, 'the_new_editorr.html', {'data': data})
def json_editor(request):
    with open('editor/static/data/graph-e.json', 'r') as f:
        data = json.load(f)
        print("graph-e:"+str(data))

    if request.method == 'POST':
        # 更新nodes
        print("post:" + str(data))
        for i, node in enumerate(data['nodes']):
            node_id = request.POST.get('node{}'.format(i))
            if node_id is not None:
                node['id'] = node_id

        # 更新links
        for i, link in enumerate(data['links']):
            source = request.POST.get('source{}'.format(i))
            target = request.POST.get('target{}'.format(i))
            if source is not None and target is not None:
                link['source'] = source
                link['target'] = target

        with open('editor/static/data/graph-e.json', 'w') as f:
            json.dump(data, f, indent=4)

    return render(request, 'editor4_two_table_binglie.html', {'data': data})


def json_editor2(request):
    with open('editor/static/data/graph.json', 'r') as f:
        data = json.load(f)
        print(data["nodes"])
        for i in data["nodes"]:
            print(i)
        print("graph-e:"+str(data))

    if request.method == 'POST':
        print("post" + str(data))
        for key in data:
            data[key] = request.POST.get(key)

        with open('data.json', 'w') as f:
            json.dump(data, f, indent=4)

    return render(request, 'editor2.html', {'data': data})
