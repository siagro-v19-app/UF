sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function(Controller, MessageBox) {
	"use strict";

	return Controller.extend("br.com.idxtecUF.controller.UF", {
		onInit: function(){
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		onRefresh: function(){
			var oModel = this.getOwnerComponent().getModel();
			
			oModel.refresh(true);
		},
		
		onIncluir: function(){
			var oDialog = this._criarDialog();
			var oModel = this.getOwnerComponent().getModel();
			
			oDialog.unbindElement();
			oDialog.setEscapeHandler(function(oPromise){
				if(oModel.hasPendingChanges()){
					oModel.resetChanges();
				}
			});
			
			var oContext = oModel.createEntry("/Ufs", {
				properties: {
					"Id": 0,
					"Codigo": "",
					"Sigla": ""
				}
			});
			
			oDialog.setBindingContext(oContext);
			oDialog.open();
		},
		
		onEditar: function(){
			var oDialog = this._criarDialog();
			var oTable = this.byId("tableUF");
			var nIndex = oTable.getSelectedIndex();
			
			if(nIndex === -1){
				MessageBox.information("Selecione um UF da tabela!");
				return;
			}
			
			var oContext = oTable.getContextByIndex(nIndex);
			
			oDialog.bindElement(oContext.sPath);
			oDialog.open();
		},
		
		onRemover: function(){
			var that = this;
			var oTable = this.byId("tableUF");
			var nIndex = oTable.getSelectedIndex();
			
			if(nIndex === -1){
				MessageBox.information("Selecione um UF da tabela!");
				return;
			}
			
			MessageBox.confirm("Deseja remover esse UF?", {
				onClose: function(sResposta){
					if(sResposta === "OK"){
						that._remover(oTable, nIndex);
						MessageBox.success("UF removido com sucesso!");
					}
				} 
			});
		},
		
		onSaveDialog: function(){
			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel();
			
			if(this._checarCampos(this.getView()) === true){
				MessageBox.information("Preencha todos os campos obrigatórios!");
				return;
			} else{
				oModel.submitChanges({
					success: function(){
						oModel.refresh(true);
						MessageBox.success("UF inserido com sucesso!");
						oView.byId("UFDialog").close();
						oView.byId("tableUF").clearSelection();
					},
					error: function(oError){
						MessageBox.error(oError.responseText);
					}
				});
			}
		},
		
		onCloseDialog: function(){
			var oModel = this.getOwnerComponent().getModel();
			
			if(oModel.hasPendingChanges()){
				oModel.resetChanges();
			}
			
			this.byId("UFDialog").close();
		},
		
		_remover: function(oTable, nIndex){
			var oModel = this.getOwnerComponent().getModel();
			var oContext = oTable.getContextByIndex(nIndex);
			
			oModel.remove(oContext.sPath, {
				success: function(){
					oModel.refresh(true);
					oTable.clearSelection();
				},
				error: function(oError){
					MessageBox.error(oError.responseText);
				}
			});
		},
		
		_criarDialog: function(){
			var oView = this.getView();
			var oDialog = this.byId("UFDialog");
			
			if(!oDialog){
				oDialog = sap.ui.xmlfragment(oView.getId(), "br.com.idxtecUF.view.UFDialog", this);
				oView.addDependent(oDialog); 
			}
			return oDialog;
		},
		
		_checarCampos: function(oView){
			if(oView.byId("codigo").getValue() === "" || oView.byId("sigla").getValue() === ""){
				return true;
			} else{
				return false; 
			}
		}
	});
});