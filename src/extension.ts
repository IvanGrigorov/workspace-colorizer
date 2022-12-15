// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let predifinedColors = [
	'red',
	'green',
	'yellow'
];

let myStatusBarItem: vscode.StatusBarItem;
myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
myStatusBarItem.command = 'workspace-colorizer.opencolorinput';
myStatusBarItem.tooltip = "Click to change color";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	toggleStatusItem(context);


	vscode.window.onDidChangeActiveTextEditor((editor) => {
		toggleStatusItem(context);
	});

	let generatedHelperCommand = generateColorCommand(context);
	context.subscriptions.push(generatedHelperCommand);
}

function generateColorCommand(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('workspace-colorizer.opencolorinput', () => {
		vscode.window.showInputBox({
			placeHolder: "Write your color in hex with # in front"
		}).then((input) => {
			let workspace = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(vscode.window.activeTextEditor!.document.fileName));
			if (workspace) {
				context.globalState.update(workspace.name, input);
				toggleStatusItem(context);
			}
		});
	});
	return disposable;
}


function toggleStatusItem(context: vscode.ExtensionContext) {
	let workspace : vscode.WorkspaceFolder | undefined;
	if (vscode.window.activeTextEditor?.document.fileName) {
		if (vscode.workspace.getWorkspaceFolder(vscode.Uri.file(vscode.window.activeTextEditor!.document.fileName))) {
			workspace = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(vscode.window.activeTextEditor!.document.fileName));
		}
	}
	if (workspace) {
		if (context.globalState.get(workspace.name)) {
			myStatusBarItem.color = context.globalState.get(workspace.name);
		}
		else {
			let color = predifinedColors[getRandomInt(3)]
			myStatusBarItem.color = color;
			context.globalState.update(workspace.name, color);
		}
		myStatusBarItem.text = workspace.name;
		myStatusBarItem.show();
	}
	else  {
		myStatusBarItem.hide();
	}
}

function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
  }
// This method is called when your extension is deactivated
export function deactivate() {}
