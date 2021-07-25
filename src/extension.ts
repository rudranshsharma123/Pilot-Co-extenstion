// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { PetSidebarProvider } from './petsidebarprovider';
import { SidebarProvider } from './sidebarprovider';

const superagent = require('superagent');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	
	console.log('Congratulations, your extension "copilot-sidebar" is now active!');

	const sidebarProvider = new SidebarProvider(context.extensionUri);
	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	
	item.text = '$(diff-added) Add Todo';
	item.command = 'copilot-sidebar.addTodo';
	item.show();
	const item2 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	
	item2.text = '$(search) Search Code Samples';
	item2.command = 'copilot-sidebar.searchCode';
	item2.show();



	async function findCode(data, selection){
		if (data.length === 0){
			vscode.window.showWarningMessage("Please Select some text");

		}
		const {activeTextEditor} = vscode.window;
		if (!activeTextEditor){
			vscode.window.showInformationMessage("No Active Text Editor is selected");
			return;
		}
		const url =  "https://www.codegrepper.com/api/search.php?q=" + data + "&search_options=search_titles";
		superagent
		.get(url)
		.end((error, response) => {
			let data = JSON.parse(response.text);
			console.log(data)
			if (data["answers"].length === 0) {
				vscode.window.showWarningMessage("Please use simpler words!");
			}
			activeTextEditor.edit(editBuilder => {
				editBuilder.replace(selection, String(data["answers"][0]["answer"]));
			});
		});
		
	}

	context.subscriptions.push(
		vscode.commands.registerCommand("copilot-sidebar.searchCode", async () => {
		  // HelloWorldPanel.kill();
		  // HelloWorldPanel.createOrShow(context.extensionUri);
		
		  const {activeTextEditor} = vscode.window;
		  if (!activeTextEditor){
			  vscode.window.showInformationMessage("No Active Text Editor is selected");
			  return;
		  }
		  const document = activeTextEditor.document;
		  const selection = activeTextEditor.selection;

		  const word = document.getText(selection);
		  await findCode(word, selection);

		})
	  );
  
	

	const petsidebarProvider = new PetSidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("copilot-sidebar-sidebar", sidebarProvider)
	  );
	  
	  context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("copilot-pet-view-sidebar", petsidebarProvider)
	  );
	  
	context.subscriptions.push(
		vscode.commands.registerCommand("copilot-sidebar.refresh", async () => {
		  // HelloWorldPanel.kill();
		  // HelloWorldPanel.createOrShow(context.extensionUri);
		  await vscode.commands.executeCommand("workbench.action.closeSidebar");
		  await vscode.commands.executeCommand(
			"workbench.view.extension.copilot-sidebar-sidebar-view"
		  );
	
		})
	  );
  
	
	context.subscriptions.push(vscode.commands.registerCommand('copilot-sidebar.helloWorld', () => {
		
		vscode.window.showInformationMessage('Hello World from copilot-sidebar!');
		HelloWorldPanel.createOrShow(context.extensionUri);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('copilot-sidebar.addTodo', () => {
		const {activeTextEditor} = vscode.window;
		if (!activeTextEditor){
			vscode.window.showInformationMessage("No Active Text Editor is selected");
			return;
		}

		const text = activeTextEditor.document.getText(activeTextEditor.selection);
		// vscode.window.showInformationMessage(text);dsad
		sidebarProvider._view?.webview.postMessage({
			type: 'new-todo',
			value:text
		});

	}));

	
}

// this method is called when your extension is deactivated
export function deactivate() {}
