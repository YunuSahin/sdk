/**
 * Copyright 2014 Scn Community Contributors
 * 
 * Original Source Code Location:
 *  https://github.com/org-scn-design-studio-community/sdkpackage/
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at 
 *  
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and 
 * limitations under the License. 
 */

sap.ui.commons.layout.AbsoluteLayout.extend ("org.scn.community.utils.PostResponseParser", {

	metadata: {
        properties: {
              "DUrl": {type: "string"},
              "DTrigger": {type: "string"},
              
              "DParameters": {type: "string"},
              "DRawParameters": {type: "string"},
              "DHeaders": {type: "string"},
              
              "DBasicAuthorisation": {type: "string"},
              "DContentType": {type: "string"},

              "DExpectedResponseStatus": {type: "int"},
              "DExpectedContentType": {type: "string"},
              
              "DReturnParameters": {type: "string"},
              "DReturnResponse": {type: "string"},
              "DReturnStatus": {type: "string"},
        }
	},

	initDesignStudio: function() {
		var that = this;
	},	
	
	renderer: {},
	
	afterDesignStudioUpdate : function() {
		var that = this;

		if(this.getDUrl() != "" && this.getDTrigger() == "GO") {
			var http = new XMLHttpRequest();
			var url = that.getDUrl();
			
			var params = "";
			var emphason = "";
			
			var lRawParameters = this.getDRawParameters();
			if(lRawParameters != undefined && lRawParameters.length > 0) {
				params = lRawParameters;
			} else {
				var lParameters = that.getDParameters();
				if((lParameters != undefined || lParameters != undefined) && lParameters != "" && lParameters != "<delete>"){
					var lParametersArray = JSON.parse(lParameters);
					
					for (var i = 0; i < lParametersArray.length; i++) {
						if(lParametersArray[i].parentKey == "ROOT") {
							params += emphason + lParametersArray[i].key + "=" + lParametersArray[i].value + "";
							emphason = "&";
						}
					}
				}
			}
			
			http.open("POST", url, true);

			// "application/json; charset=utf-8"
			if(this.getDContentType() != "") {
				http.setRequestHeader("Content-type", that.getDContentType());	
			}
			
			
			if(this.getDBasicAuthorisation() != "") {
				http.setRequestHeader("Authorization", that.getDBasicAuthorisation());	
			}
			
			var lHeaders = that.getDHeaders();
			if((lHeaders != undefined || lHeaders != undefined) && lHeaders != "" && lHeaders != "<delete>"){
				var lHeadersArray = JSON.parse(lHeaders);
				
				for (var i = 0; i < lHeadersArray.length; i++) {
					if(lHeadersArray[i].parentKey == "ROOT") {
						http.setRequestHeader(lHeadersArray[i].key, lHeadersArray[i].value);	
					}
				}
			}

			var returnParameters = [];
			
			http.onreadystatechange = function() {
			    if(http.readyState == 4) {
			    	var response = http.responseText;
		    		var status = http.status;
		    		
			    	if(http.status == that.getDExpectedResponseStatus()){
			    		if(that.getDExpectedContentType() == "JSON") {
			    			try{
			    				var responseJson = JSON.parse(response);
			    				
			    				for (lElementKey in responseJson) {
			    					returnParameters.push({name: lElementKey, value: responseJson[lElementKey]});
			    				}
			    				
			    			} catch (e) {
			    				returnParameters.push({name: "STATUS", value: "PARSE_ERROR"});
			    			}
			    		}
			    		
			    		returnParameters = JSON.stringify(returnParameters);
			    		
			    		that.setDReturnParameters(returnParameters);
			    		that.setDReturnResponse(response);
			    		that.setDReturnStatus(status);
			    		
			    		var changed = ["DReturnParameters", "DReturnResponse", "DReturnStatus"];
						
						that.fireDesignStudioPropertiesChanged(changed);
						that.fireDesignStudioEvent("onResponse");
			    	} else {
			    		returnParameters.push({name: "STATUS", value: "ERROR"});
			    		returnParameters = JSON.stringify(returnParameters);
			    		
			    		that.setDReturnParameters(returnParameters);
			    		that.setDReturnResponse(response);
			    		that.setDReturnStatus(status);
			    		
			    		var changed = ["DReturnParameters", "DReturnResponse", "DReturnStatus"];
						
						that.fireDesignStudioPropertiesChanged(changed);
						that.fireDesignStudioEvent("onResponse");
			    	}
			    }
			}
			
			try {
				http.send(params);	
			} catch (e) {
				// in case the send is not working, can happen on cors (https > http)
				returnParameters = JSON.stringify(returnParameters);
				that.setDReturnParameters(returnParameters);
				
				var response = "EXCEPTION\r\n";
				if(e.name) {response = "NAME: " + e.name + "\r\n";}
				if(e.message) {response = "MESSAGE: " + e.message + "\r\n";}
	    		that.setDReturnResponse(response);
	    		
	    		that.setDReturnStatus(500);

				that.setDTrigger("");

	    		var changed = ["DTrigger", "DReturnParameters", "DReturnResponse", "DReturnStatus"];
				
				that.fireDesignStudioPropertiesChanged(changed);
				that.fireDesignStudioEvent("onResponse");
			}
			
			if(that.getDTrigger() != "") {
				// clean up the trigger
				that.setDTrigger("");

				// fire event to rerender
				that.fireDesignStudioPropertiesChanged(["DTrigger"]);
			}
		}
	}
});
