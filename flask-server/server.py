from flask import Flask, request, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

issues = []
issue_id_counter = 1 

def generate_issue_id():
    global issue_id_counter
    issue_id = issue_id_counter
    issue_id_counter += 1
    return issue_id

def create_issue(data):
    issue_id = generate_issue_id()
    data['id'] = issue_id
    issues.append(data)
    return data

def update_issue(id, data):
    for i, issue in enumerate(issues):
        if issue['id'] == id:
            issues[i] = data
            return data
    return None

def delete_issue(id):
    for issue in issues:
        if issue['id'] == id:
            issues.remove(issue)
            return True
    return False

@app.route('/issues', methods=['GET', 'POST'])
def manage_issues():
    if request.method == 'GET':
        return jsonify(issues)
    elif request.method == 'POST':
        data = request.get_json()
        created_issue = create_issue(data)
        print("Received JSON for Create:", data)
        return jsonify(created_issue), 201

@app.route('/issue/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def manage_issue(id):
    if request.method == 'GET':
        for issue in issues:
            if issue['id'] == id:
                print("Received GET Request for Issue ID:", id)
                return jsonify(issue)
        return "Issue not found", 404

    elif request.method == 'PUT':
        data = request.get_json()
        updated_issue = update_issue(id, data)
        if updated_issue:
            print("Received JSON for Update:", data)
            return jsonify(updated_issue)
        else:
            return "Issue not found", 404

    elif request.method == 'DELETE':
        if delete_issue(id):
            print("Received DELETE Request for Issue ID:", id)
            return "Issue deleted", 204
        else:
            return "Issue not found", 404

if __name__ == '__main__':
    app.run(debug=True)