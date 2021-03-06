(function() {
	 var myScript = $("script:last")[0].src;
	 var ownComponentName = "org.scn.community.databound.Choropleth";
	 var _readScriptPath = function () {
		 var scriptInfo = org_scn_community_basics.readOwnScriptAccess(myScript, ownComponentName);
		 return scriptInfo;
	 };
	 /** end of recognition of script path */
	 /** RequireJS Config **/
	 var pathInfo = _readScriptPath();
	 sap.zen.Dispatcher.instance.pauseDispatching();
	 var sdkReqs = require.config({
		 context : "sdk",
		 paths: {
			d3 :		pathInfo.mainSDKPath + "org.scn.community.databound/os/d3v3/d3.min",
			d3tip :		pathInfo.mainSDKPath + "org.scn.community.databound/os/d3v3/d3-tip",
			topojson : 	pathInfo.mainSDKPath + "org.scn.community.databound/os/d3v3/topojson.v1.min",
			"d3-geo-projection" : 	pathInfo.mainSDKPath + "org.scn.community.databound/os/d3v3/d3.geo.projection"
		 }
	 });
	 sdkReqs(["require","d3","d3tip","topojson","d3-geo-projection"], function(require,d3,d3tip,topojson,d3geoproj) {
		 /**
		 * Choropleth on D3 Example:
		 * http://bl.ocks.org
		 */
		 Choropleth.prototype = org_scn_community_databound_BaseViz;
		 Choropleth.prototype.constructor = Choropleth;
		 Choropleth.prototype.toString = function(){
	    	 return ownComponentName;
	     }
	     function Choropleth() {
	    	 var that = this;
			 var tip = d3tip()
			 	.attr('class', 'd3-tip')
			 	.html(function(d) { 
			 		var html = "<span>";
			 		var mm = that.measureMember();
			 		if(!mm){
			 			if(that._flatData && that._flatData.columnHeaders && that._flatData.columnHeaders.length > 1) mm = that._flatData.columnHeaders[0];
			 		}
			 		var val = null;
			 		if(d.propertiees && d.properties.designStudioMeasures && d.properties.designStudioMeasures[mm]){
			 			val = d.properties.designStudioMeasures[mm];
			 		}
		 			var tt = "";
		 				if(d.properties && d.properties[that.labelProperty()]){
			 				tt+="<b>" + d.properties[that.labelProperty()] + "</b>";
			 			}
			 			if(d.properties && d.properties.designStudioMeasures){
			 				tt +="<br/><ul>"
			 				var dsm = d.properties.designStudioMeasures;
			 				for(var measure in dsm){
			 					tt+="<li><b>" + measure + "</b>: " + that.formatter(dsm[measure]) + "</li>";
			 				}
			 				tt +="</ul>";
			 			}
			 			if(d.properties && d.properties[that.featureProperty()]){
			 				
			 			}
			 		html+=tt;
			 		html+="</span>";
			 		return html;
			 	})
			 	.offset(function(d) {
			 		return [this.getBBox().height / 2 - 12, 0]
			 	});
	    	// Call super
	    	org_scn_community_databound_BaseViz.call(this, d3,{
	    		styleClasses : { value : ""},
				selectedFeature : { value : ""},
				hoverColor : { value : ""},
				centerFeature : { value : ""},
				featureProperty : { value : "NAME_1"},
				labelProperty : { value : "NAME_1"},
				measureMember :  { value : "" },
				floor :  { value : 0 },
				defaultFillColor : { value : "#E5EADE" },
				backgroundColor : { value : "transparent" },
				projection : { value : "mercator" },
				tooltipOn :  { value : true },
				legendOn :  { value : true },
				globeOn :  { value : true },
				graticuleOn :  { value : true },
				gradientLeft : { value : 30 },
				gradientRight : { value : 30 },
				gradientBottom :  { value : 15 },
				gradientHeight :  { value : 10 },
				labelSize :  { value : 10 },
				labelThreshold :  { value : 80 },
				colorPalette :  { value : "#F0F9E8,#CCEBC5,#A8DDB5,#7BCCC4,#43A2CA,#0868AC" },
				colorScale : { value : "quantile" },
				mapData : { 
					value : "",
					onChange : function(value){
						var j = {};
						try{
							if(value!=""){
								j = jQuery.parseJSON(value);
							}
							this._mapJSON = this.processMapData(j);
						}catch(e){
							this._mapJSON = {};
							//throw "Error with Map Data.\n\n" + e;
						}
					}
				},
				plotLeft : { value : 0 },
				plotTop : { value : 0 },
				plotRight : { value : 0 },
				plotBottom : { value : 0 },
				center : { value : "0,0" },
				scale : { value : 150 },
				yaw : { value : 0.0 },
				pitch : { value : 0.0 },
				roll : { value : 0.0 },
	    		selectedColor : { value : "#009966"},
	    		selectedValue : { value : 0.0}
			});
	    	this.projections = {
	    	   "Albers USA": d3.geo.albersUsa(),
	    	   "Mercator": d3.geo.mercator().scale(490 / 2 / Math.PI),
	    	   "Equirectangular": d3.geo.equirectangular(),
	    	   "Orthographic": d3.geo.orthographic(),
	    	   
	    	   "Aitoff": d3.geo.aitoff(),
               "Albers": d3.geo.albers().scale(145).parallels([20, 50]),
               "August": d3.geo.august().scale(60),
               "Baker": d3.geo.baker().scale(100),
               "Boggs": d3.geo.boggs(),
               "Bonne": d3.geo.bonne().scale(120),
               "Bromley": d3.geo.bromley(),
               "Collignon": d3.geo.collignon().scale(93),
               "Craster Parabolic": d3.geo.craster(),
               "Eckert I": d3.geo.eckert1().scale(165),
               "Eckert II": d3.geo.eckert2().scale(165),
               "Eckert III": d3.geo.eckert3().scale(180),
               "Eckert IV": d3.geo.eckert4().scale(180),
               "Eckert V": d3.geo.eckert5().scale(170),
               "Eckert VI": d3.geo.eckert6().scale(170),
               "Eisenlohr": d3.geo.eisenlohr().scale(60),
               "Hammer": d3.geo.hammer().scale(165),
               "Hill": d3.geo.hill(),
               "Goode Homolosine": d3.geo.homolosine(),
               "Kavrayskiy VII": d3.geo.kavrayskiy7(),
               "Lambert cylindrical equal-area": d3.geo.cylindricalEqualArea(),
               "Lagrange": d3.geo.lagrange().scale(120),
               "Larrivée": d3.geo.larrivee().scale(95),
               "Laskowski": d3.geo.laskowski().scale(120),
               "Loximuthal": d3.geo.loximuthal(),
               "Miller": d3.geo.miller().scale(100),
               "McBryde–Thomas Flat-Polar Parabolic": d3.geo.mtFlatPolarParabolic(),
               "McBryde–Thomas Flat-Polar Quartic": d3.geo.mtFlatPolarQuartic(),
               "McBryde–Thomas Flat-Polar Sinusoidal": d3.geo.mtFlatPolarSinusoidal(),
               "Mollweide": d3.geo.mollweide().scale(165),
               "Natural Earth": d3.geo.naturalEarth(),
               "Nell–Hammer": d3.geo.nellHammer(),
               "Polyconic": d3.geo.polyconic().scale(100),
               "Robinson": d3.geo.robinson(),
               "Sinusoidal": d3.geo.sinusoidal(),
               "Sinu-Mollweide": d3.geo.sinuMollweide(),
               "van der Grinten": d3.geo.vanDerGrinten().scale(75),
               "van der Grinten IV": d3.geo.vanDerGrinten4().scale(120),
               "Wagner IV": d3.geo.wagner4(),
               "Wagner VI": d3.geo.wagner6(),
               "Wagner VII": d3.geo.wagner7(),
               "Winkel Tripel": d3.geo.winkel3()
	     	};
	    	this.projectionTween = function(projection0, projection1) {
	    		return function(d) {
	    			var t = 0;
	    			
	    			var projection = d3.geo.projection(project)
	    				.scale(1)
	    				.translate([that.dimensions.plotWidth / 2, that.dimensions.plotHeight / 2]);

    				var path = d3.geo.path().projection(projection);   				

	    			function project(λ, φ) {
						λ *= 180 / Math.PI, φ *= 180 / Math.PI;
						var p0 = projection0([λ, φ]), p1 = projection1([λ, φ]);
						return [(1 - t) * p0[0] + t * p1[0], (1 - t) * -p0[1] + t * -p1[1]];
					}					

					return function(_) {
						t = _;
						return path(d);
					};
	    		};
	    	}
	    	/**
			 * Convert any TopoJSON data into GeoJSON
			 */
			this.processMapData = function(mapData) {
			    var obj;
			    var returnObject = mapData;		// Assume GeoJSON
			    if (mapData && mapData.type && mapData.type.toLowerCase() === 'topology' && typeof topojson != 'undefined') {
			    	// Use first object found if object not defined
			        for (var o in mapData.objects) {
			          if (mapData.objects.hasOwnProperty(o)) {
			            obj = mapData.objects[o];
			            break;
			          }
			        }
			      returnObject = topojson.feature(mapData, obj);
			    }
			    return returnObject;
			};
			/**
			 * This adds flattened Design Studio Data to the GeoJSON under a property called 'designStudioMeasures'
			 */
			this.applyMeasures = function(mapData,flatData){
				try{
					if(mapData && mapData.features && mapData.features.length > 0){
						var propertyName = this.featureProperty();
						for(var featureIndex = 0;featureIndex<mapData.features.length;featureIndex++){
							var feature = mapData.features[featureIndex];
							var match = false;
							if(feature.properties && feature.properties[propertyName]){
								var currentPropertyValue = feature.properties[propertyName];
								if(flatData && flatData.hash && flatData.hash[currentPropertyValue] != undefined){
									var rowIndex = flatData.hash[currentPropertyValue];
									var measures = {};
									for (var i=0;i<flatData.columnHeaders.length;i++){
										measures[flatData.columnHeaders[i]] = flatData.values[rowIndex][i];
									}
									//alert("Match found on " + rowIndex + currentPropertyValue + "\n\nAttaching " + JSON.stringify(measures));
									feature.properties.designStudioMeasures = measures;
								}else{
									feature.properties.designStudioMeasures = {};
								}
							}else{
								feature.properties.designStudioMeasures = {};
							}
						}
					}
				}catch(e){
					throw("A problem was encountered while applying data to map:\n\n" + e);
				}
			};
			/**
			 * Sets BIAL-level selected feature and fires onSelect event.
			 */
			this.setSelectedFeature = function(d){				
				if(d.properties && d.properties[this.featureProperty()]) {
					if(d.properties[this.featureProperty()]==this.selectedFeature()){
						this.selectedFeature("");
					}else{
						this.selectedFeature(d.properties[this.featureProperty()]);	
					}
					this.firePropertiesChanged(["selectedFeature"]);
					this.fireEvent("onSelect");
				}
			};
			/**
			 * Handle tooltip updates
			 */
			this.doTooltip = function(d) {
				that.lastHover = d.properties[that.featureProperty()];
				tip.show.call(this,d);
				that.updateTriangles();
			}
			var parentPreReq = this.preReqCheck;
			this.preReqCheck = function(){
				// Map component is tolerant of no data.  Override method.
				//var status = parentPreReq.apply(this);
				//if(!status.success) return status;
				var status = {
					success : true
				};
				if(!this._mapJSON || !this._mapJSON.features) status = {
					success : false,
					reason : "No Map Data set.  Open Additional Properties Sheet to download a map!"
				};
				return status;
			};
			/**
			 * Calculate Visualization Sizing
			 */
			var parentCalculateDimensions = this.calculateDimensions;
			this.calculateDimensions = function(){
				parentCalculateDimensions.call(this);
				this.dimensions.gradientLeft = this.gradientLeft();
				this.dimensions.gradientRight = this.gradientRight();
				this.dimensions.gradientHeight = this.gradientHeight();
				this.dimensions.gradientBottom = this.gradientBottom();
				this.dimensions.gradientWidth = this.dimensions.plotWidth - this.dimensions.gradientLeft - this.dimensions.gradientRight;
				//alert(JSON.stringify(this.dimensions));
				return this;
			}
			/**
			 * After Update
			 */
			var parentAfterUpdate = this.afterUpdate;
			this.afterUpdate = function(){
				this.applyMeasures(this._mapJSON,this.flatData);
				parentAfterUpdate.call(this);
			};
			/**
			 * Init
			 */
	    	var parentInit = this.init;
	    	this.init = function(){
	    		parentInit.call(this);
	    		this.svg.call(tip);
	    		this.$().addClass("Choropleth");
	    		this.container = d3.select("#"+this.$().attr("id"));
	    		// Globe Layer
	    		this.globePath = this.plotLayer.append('path')
	    			.datum({ type: 'Sphere' })
	    			.attr('class', 'globe');
	    		// Graticule Layer
	    		this.graticule = d3.geo.graticule();
		        this.graticulePath = this.plotLayer.append('path')
	            	.datum(this.graticule)
	            	.attr('class', 'graticule');
		        this.proj = this.projections[this.projection()] || this.projections["Mercator"];
		        this.projPath = d3.geo.path().projection(this.proj);
	    		this.pathGroup = this.plotLayer.append('g')
    				.attr('class', 'path-group');
	    		this.labelGroup = this.plotLayer.append('g')
    				.attr('class', 'label-group');
		        
	    		// Horizontal Scale/Legend
	    		var legend2Transform = this.dimensions.gradientLeft + "," + (this.dimensions.plotHeight - (this.dimensions.gradientBottom + this.dimensions.gradientHeight));
	    		var tickTransform = "0," + (0 - this.dimensions.gradientHeight);
			    this.legend2 = this.canvas.append("g")
    				.attr("transform", "translate(" + legend2Transform +")");	    		
    	 		this.gradientRects = this.legend2.append("g")
					.attr("class", "gradient-rects");
    	 		this.selTriangle = this.legend2.append("path")
	    			.attr("opacity",0)
	    			.attr("fill",that.selectedColor())
					.attr("d","M-"+this.gradientHeight()/2+" 0 L"+this.gradientHeight()/2+" 0 L 0 "+this.gradientHeight()/2+" Z");
    	 		this.triangle = this.legend2.append("path")
	    			.attr("opacity",0)
	    			.attr("fill",that.hoverColor())
					.attr("d","M-"+this.gradientHeight()/2+" 0 L"+this.gradientHeight()/2+" 0 L 0 "+this.gradientHeight()/2+" Z");
	    		this.gradientTicks = this.legend2.append("g")
	    			.attr("class", "gradient-ticks")
	    			.attr("transform", "translate(" + tickTransform +")");
	    		
			    return this;
	    	}
	    	/**
			 * Update Color Range
			 */
			this.updateColorRange = function(){
		        var d, domain;
		        this.valuesSet = [this.floor()];
	        	// Get values for range
		        for (d = 0; d < this._mapJSON.features.length; d++) {
	        		if(this._mapJSON.features[d].properties.designStudioMeasures){
	        			var mm = this.measureMember();
						if(!mm){
							if(this.flatData && this.flatData.columnHeaders && this.flatData.columnHeaders.length > 1) mm = this.flatData.columnHeaders[0];
						}
	        			this.valuesSet.push(parseFloat(this._mapJSON.features[d].properties.designStudioMeasures[mm]));	
	        		}else{
	        			this.valuesSet.push(null);
	        		}
		        }
		        this.valuesSet.sort(function(a, b) { return a - b; });
		        // Make range with appropriate values
		        var cp = [];
		        if(this.colorPalette()!="") cp = this.colorPalette().split(",");
		        this.colorRange = d3.scale[this.colorScale()]()
		        	.domain(this.valuesSet)
		        	.range(cp);
		        // Clamp if can
		        if (typeof this.colorRange.clamp == 'function') {
		        	this.colorRange.clamp(true);
		        }
		        
		        	
		        return this;
			};
			this.adjustPlotZoom = function(){
				try{
				// Update features
	    		this.plotLayer.attr("transform","translate(" + this.zoomTranslate + ") scale(" + this.zoomScale + ")");
	    		this.graticulePath.style("stroke-width", 1 / this.zoomScale);
	    		this.globePath.style("stroke-width", 1 / this.zoomScale);
	    		this.pathGroup.selectAll("path").style("stroke-width", 1 / this.zoomScale)
	    		this.labelGroup.selectAll("text").style("font-size", (this.labelSize() / this.zoomScale) + "px");
	    		// Hide tight labels
				this.labelGroup.selectAll("text")
				.attr("opacity", function(d, i){
					var mapShape = that.pathGroup.select(".path#" + that.$().attr("id")+"_feature_" + i );
						if(mapShape.empty()){
						return 0;
						// noop
					}else{
						var w = this.getBBox().width;
						var fw = mapShape[0][0].getBBox().width;
						//alert(w+"\n\n"+fw);
						if(w/fw < that.labelThreshold()/100) {
							return 1;
						}
					}
					return 0;
				});
				}catch(e){
					alert(e);
				}
			}
	    	var parentUpdatePlot = this.updatePlot;
	    	/**
			 * Update Features
			 */
			this.updatePlot = function(){
				try{
				//alert(this.labelSize()/this.zoomScale);
				parentUpdatePlot.call(this);
				// Horizontal Scale/Legend
				var legend2Transform = this.dimensions.gradientLeft + "," + (this.dimensions.plotHeight - (this.dimensions.gradientBottom + this.dimensions.gradientHeight));
		    	this.legend2
		    		.transition().duration(this.ms())
		    		.attr("transform", "translate(" + legend2Transform +")");
		    	var trans = "0," + (0 - this.dimensions.gradientHeight);
		    	this.gradientTicks
		    		.transition().duration(this.ms())
		    		.attr("transform", "translate(" + trans +")");
				this.plotArea
		    		.transition().duration(this.ms())
	    			.attr("transform", "translate("+this.dimensions.plotLeft+","+this.dimensions.plotTop+")");
				this.clipRect
					//.transition().duration(this.ms())
					.attr("width", this.dimensions.plotWidth)
					.attr("height", this.dimensions.plotHeight);
				this.updateColorRange();
				this.updateProjection();
				var that = this;
				// Data
				var features = this.pathGroup.selectAll('path').data(this._mapJSON.features);
				var labels = this.labelGroup.selectAll('text').data(this._mapJSON.features);
				// Enter
				var newFeatures = features.enter().append("path")
					.attr("class","path");
				
				var newLabels = labels.enter().append("text")
					.attr('class', function(d) { return "subunit-label " + d.properties[that.labelProperty()]; })
					.attr("pointer-events", "none")
					.attr("transform", function(d) { return "translate(" + that.projPath.centroid(d) + ")"; })
					.attr("dy", ".35em")
					.text(function(d) { return d.properties[that.labelProperty()]; });

				// Update graticule
	    		this.graticulePath
	    			.transition().duration(this.ms())
	    			.attr('opacity', function(){ if(that.graticuleOn()){
	    				return 1;
	    			}else{
	    				return 0;
	    			}})
            		.attr('d', this.projPath);
	    		// Update globe
	    		this.globePath
	    			.transition().duration(this.ms())
	    			.attr('opacity', function(){ if(that.globeOn()){
	    				return 1;
	    			}else{
	    				return 0;
	    			}})
        			.attr('d', this.projPath);
	    		
				this.pathGroup.selectAll("path")
					.transition().duration(this.ms())
					.attr("class",function(d){return "path";})
					.attr("id",function(d,i){return that.$().attr("id")+"_feature_" + i;})
					.attr("d",this.projPath)
					.attr("opacity",this.plotAlpha()/100)
					.attr("fill", function(d) {
						if(d.properties && d.properties && d.properties[that.featureProperty()]){
							if(d.properties[that.featureProperty()]==that.selectedFeature() && that.selectedColor()) return that.selectedColor();
						}
						if(d.properties && d.properties.designStudioMeasures){
							var mm = that.measureMember();
							if(!mm){
								if(that.flatData && that.flatData.columnHeaders && that.flatData.columnHeaders.length > 1) mm = that.flatData.columnHeaders[0];
							}
							return that.colorRange(d.properties.designStudioMeasures[mm]) || that.defaultFillColor();	
						}else{
							return that.defaultFillColor();
						}
					});
				this.labelGroup.selectAll("text")
					.transition().duration(this.ms())
					.attr('class', function(d) { return "subunit-label " + d.properties[that.labelProperty()]; })
					.attr("transform", function(d) { return "translate(" + that.projPath.centroid(d) + ")"; })
					.text(function(d) { return d.properties[that.labelProperty()]; });

				// Events
				this.pathGroup.selectAll('path')
					.on('mouseover', this.doTooltip)
					.on('mouseout', function(d) {
						tip.hide(d);
						that.triangle
							.transition().duration(that.ms())
							.attr("opacity",0);
					})
					.on('click', function(d){ 
						d3.select(this)
							.transition().duration(that.ms())
							.attr("fill",that.selectedColor());
						that.setSelectedFeature(d);
						that.updateTriangles();
					});
				this.labelGroup.selectAll("text")
					.on('mouseover', this.doTooltip);
				// Exit
				 features.exit().remove();
				 labels.exit().remove();
				 this.adjustPlotZoom();
				return this;
				}catch(e){
					alert("Error updating plot:\n\n"+e);
				}
			}
	    	var parentUpdateLegend = this.updateLegend;
	    	/**
			 * Update Legend
			 */
			this.updateLegend = function(){
				parentUpdateLegend.call(this);
				this.updateColorRange();
				// LEGEND
			    var unit = 10;								// Swatch Size
			    var min = d3.min(this.valuesSet);
			    var max = d3.max(this.valuesSet);
			    var legendSwatches = [];
			    var gradientStops = [];
			    var c = this.colorPalette();
			    if(c!="") gradientStops = c.split(","); 
			    var extents = [];
			    if (this.colorScale() == 'quantile') {
			    	legendSwatches = this.colorRange.quantiles();
			    }
				if (this.colorScale() === 'quantize') {
					for (var i=0; i < gradientStops.length; i++) {
						legendSwatches.push(this.colorRange.invertExtent(gradientStops[i])[0]);
					}
				}
				for(var i=0;i<gradientStops.length;i++){
		    		// Push min in 1st position?
		    		extents.push({
		    			min : this.colorRange.invertExtent(gradientStops[i])[0],	// Returns array of [min,max] per quantile "bucket"
		    			max : this.colorRange.invertExtent(gradientStops[i])[1],
		    		});
		    	}

				/**
				 * https://github.com/mbostock/d3/wiki/Quantitative-Scales
				 * legendSwatches - [100,150,1500,2000] // Comes from colorRange.quantiles
				 * gradientStop   - [#009966,#000000]
				 * invertExtent(index) - [min,max] of quantile bucket
				 * 
				 */
				
				//Ensure we have something to make a legend with
				if (legendSwatches && legendSwatches.length > 0) {
			        var scale = d3.scale.linear()
			        	.range([0,1])
			        	.domain([min,max]);
			        
			        this.tickScale = d3.scale.linear()
		        		.range([0,this.dimensions.gradientWidth])
		        		.domain([min,max]);
			        		        
			        var tickValueScale = d3.scale.ordinal()
	        			.rangePoints([0,this.dimensions.gradientWidth])
	        			.domain(legendSwatches);
			        
			        var rects = this.legendGroup.selectAll('rect.legend-swatch').data(extents);
			        var rects2 = this.gradientRects.selectAll("rect").data(extents);
			        var ticks = this.gradientTicks.selectAll("line").data(extents);
			        var tickLabels = this.gradientTicks.selectAll("text").data(extents);
					var legendLabels = this.legendGroup.selectAll('text.legend-amount').data(extents);
					
			        rects2.enter().append("rect");
			        /*
			         * Too cluttered
			        ticks.enter().append("line")
			        	.attr("stroke-width", 1)
			        	.attr("stroke", "black");
			        
			        tickLabels.enter().append('text')
						.attr('class', 'tick-label')
						.attr("dy", "0em")
						.attr("y",-5)
						.style("text-anchor", "middle")
						.style("font-size", "8pt")
						.text(function(d) { return that.formatter(d); });
			        */
			        rects2.exit().remove();
			        ticks.exit().remove();
					tickLabels.exit().remove();
					
			        // Make Solid
					/*this.gradientDef.selectAll("stop")
			        	.transition().duration(this.ms())
			        	.attr("offset",function(d){return scale(d) * 100 + "%";})
			        	.attr("stop-color",function(d){return that.colorRange(d);})
			        	.attr("stop-opacity",1);
			        */

					this.gradientRects.selectAll("rect")
						.transition().duration(this.ms())
			        	.attr("x",function(d){return that.tickScale(d.min);})
			        	.attr("width",function(d){return that.tickScale(d.max) - that.tickScale(d.min);})
			        	.attr("y",0)
			        	.attr("height",this.dimensions.gradientHeight)
			        	.attr("fill",function(d){return that.colorRange(d.min);});
			        
			        this.gradientTicks.selectAll("line")
			        	.transition().duration(this.ms())
			        	.attr("x1",function(d){return that.tickScale(d.min);})
			        	.attr("x2",function(d){return that.tickScale(d.min);})
			        	.attr("y1",0).attr("y2",this.dimensions.gradientHeight)
					
			        this.gradientTicks.selectAll("text")
						.transition().duration(this.ms())
						.attr("x",function(d){return that.tickScale(d.min);})
						.text(function(d) { return that.formatter(d.min); });
					
					/**
					 * LEGEND
					 */
					this.legendRect
			    		.transition().duration(this.ms())
    					.attr('width', this.dimensions.legendWidth)
    					.attr('height', extents.length * (unit * 2) + (unit * 3));
					this.legendLabel
			    		.transition().duration(this.ms())	
			    		.attr('font-size', unit)
				        .attr('x', (unit * 1))
				        .attr('y', (unit * 2))
				        .text(function(){
				        	var mm = that.measureMember();
							if(!mm){
								if(that.flatData && that.flatData.columnHeaders && that.flatData.columnHeaders.length > 1) mm = that.flatData.columnHeaders[0];
							}
				        	if(that.legendTitle()=="") {
				        		return mm || "No Measure Found";
				        	}else{
				        		return that.legendTitle();
				        	}
				        });
					// Add colors swatches
					
					
					// Enter Color Swatches
					rects.enter().append('rect')
						.attr('class', 'legend-swatch');
						
					// Exit Color Swatches
					rects.exit().remove();

					// Update Color Swatches
					this.legendGroup.selectAll('rect.legend-swatch')
						.transition().duration(this.ms())  
						.attr('width', unit)
						.attr('height', unit)
						.attr('x', (unit * 1))
						.attr('y', function(d, i) { return (i * unit * 2) + (unit * 3); })
						.style('fill', function(d, i) { return that.colorRange(d.min); });
					
					// Enter swatch labels
					legendLabels.enter().append('text').attr('class', 'legend-amount');
					// Exit swatch labels
					legendLabels.exit().remove();
					// Update - why doesn't text update here, or does it?
					
					this.legendGroup.selectAll('text.legend-amount')
						.transition().duration(this.ms())
					    .attr('font-size', unit)
					    .attr('x', (unit * 3))
					    .attr('y', function(d, i) { return (i * unit * 2) + (unit * 4 - 1); })
					    .text(function(d, i) { return '>= ' + that.formatter(d.min); });		
				    }
				return this;
			}
			/**
			 * Semantic Zooming
			 */
			var parentSemanticZoomed = this.semanticZoomed;
			this.semanticZoomed = function(){
				//alert("X\n" + that.zoomXScale.domain() + "\n" + that.zoomXScale.range() + "\n\nY:\n" + that.zoomYScale.domain() + "\n" + that.zoomYScale.range());
				that.zoomScale = d3.event.scale;
				that.zoomTranslate = d3.event.translate;
				//alert(JSON.stringify(d3.event));
				if(d3.event.scale==that.minZoom()) {
					that.zoomYScale.domain([0, that.dimensions.plotHeight])
						.range([0, that.dimensions.plotHeight]);
					that.zoomXScale.domain([0, that.dimensions.plotWidth])
						.range([0, that.dimensions.plotWidth]);
				} 
				//that.afterUpdate();
				//that.updateProjection();
				that.adjustPlotZoom();
			}
	    	/**
			 * Update Projection
			 */
			this.updateProjection = function(){
				// Determine Center of Map
		    	// this.centroid = d3.geo.centroid(this._mapJSON);
		    	var centerFeature = null;
		    	for(var i=0;i<this._mapJSON.features.length;i++){
		    		var f = this._mapJSON.features[i];
		    		if(f.properties && f.properties[this.featureProperty()] && f.properties[this.featureProperty()]==this.centerFeature()){
		    			centerFeature = f;
		    		}
		    	}
		    	this.centroid = d3.geo.centroid(centerFeature);
		    	// Create projection
		    	this.proj = this.projections[this.projection()] || this.projections["Mercator"];
		    	this.proj
	    			.scale(1)
	    			.translate([0,0]);
	    		// Create path
		    	this.projPath.projection(this.proj);
		    	/*
		    	 * My head hurts.
		    	this.pathGroup.selectAll("path")
		    		.transition().duration(this.ms())
		    		.attrTween("d",this.projectionTween(this.proj, this.proj = this.proj = this.projections[this.projection()] || this.projections["Mercator"]));
		    	*/          	
	    		// Compute the bounds of a feature of interest, then derive scale & translate.
		    	
		    	
		    	var b = this.projPath.bounds(this._mapJSON),
		    	    s = (.95/* * this.zoomScale*/) / Math.max((b[1][0] - b[0][0]) / this.dimensions.plotWidth, (b[1][1] - b[0][1]) / this.dimensions.plotHeight);
		    	
		    	var t = this.zoomTranslate.slice();
		    	if(this.zoomScale >= 1){
		    		//alert(this.zoomScale + "\n\n" + this.zoomTranslate);
		    		t = [((this.dimensions.plotWidth - s * (b[1][0] + b[0][0])) / 2), 
		    	         ((this.dimensions.plotHeight - s * (b[1][1] + b[0][1])) / 2)
		    	    ];
		    	}		    	    
		    	//alert(s);
		    	this.proj.scale(s).translate(t);
		    	//alert(this.zoomTranslate);
		    	// Center if projection supports
		    	if(typeof this.proj.center === "function"){
		    		if(centerFeature) this.proj.center(this.centroid);
		    	}
		    	// Rotate if projection supports
		    	if (typeof this.proj.rotate === "function") {
		    	    this.proj.rotate([this.yaw(),this.pitch(),this.roll()]);
		    	}
		    	if(this.projection()=="Orthographic") this.proj.clipAngle(90);
		    	return this;
			}
			/**
			 * Update Triangles
			 */
			this.updateTriangles = function(){
				var selectedFeature = this.findFeature(this.selectedFeature());
				var hoverFeature = this.findFeature(this.lastHover);
				if(selectedFeature) {
					var mm = that.measureMember();
					if(!mm){
						if(that.flatData && that.flatData.columnHeaders && that.flatData.columnHeaders.length > 1) mm = that.flatData.columnHeaders[0];
					}
					var val = null;
					if(selectedFeature.properties && selectedFeature.properties.designStudioMeasures && selectedFeature.properties.designStudioMeasures[mm]){
						val = selectedFeature.properties.designStudioMeasures[mm];
					}
					this.selTriangle
						.transition().duration(that.ms())
						.attr("d","M-"+that.gradientHeight()/2+" 0 L"+that.gradientHeight()/2+" 0 L 0 "+that.gradientHeight()/2+" Z")
						.attr("fill",that.selectedColor())
						.attr("opacity",1)
						.attr("transform", "translate("+that.tickScale(val)+","+(0-that.dimensions.gradientHeight)+")");
				}else{
					// No selected feature found
					this.selTriangle
						.transition().duration(that.ms())
						.attr("fill",that.selectedColor())
						.attr("d","M-"+that.gradientHeight()/2+" 0 L"+that.gradientHeight()/2+" 0 L 0 "+that.gradientHeight()/2+" Z")
						.attr("opacity",0)
						.attr("transform", "translate(0,"+(0-that.dimensions.gradientHeight)+")");
				}
				if(hoverFeature){
					var mm = that.measureMember();
					if(!mm){
						if(that.flatData && that.flatData.columnHeaders && that.flatData.columnHeaders.length > 1) mm = that.flatData.columnHeaders[0];
					}
					var val = null;
					if(hoverFeature.properties && hoverFeature.properties.designStudioMeasures && hoverFeature.properties.designStudioMeasures[mm]){
						val = hoverFeature.properties.designStudioMeasures[mm];
					}
					that.triangle
						.transition().duration(that.ms())
						.attr("d","M-"+that.gradientHeight()/2+" 0 L"+that.gradientHeight()/2+" 0 L 0 "+that.gradientHeight()/2+" Z")
						.attr("fill",that.hoverColor())
						.attr("opacity",1)
						.attr("transform", "translate("+that.tickScale(val)+","+(0-that.dimensions.gradientHeight)+")");
				}
			}
			this.findFeature = function(featureName){
				if(!this._mapJSON || !this._mapJSON.features) return null;
				for(var i=0;i<this._mapJSON.features.length;i++){
					var feature = this._mapJSON.features[i];
					if(feature.properties && feature.properties[this.featureProperty()]) {
						var property = feature.properties[this.featureProperty()];
						if(property == featureName) return feature;
					}
				}
				return null;
			}
		}
	     
		sap.designstudio.sdk.Component.subclass(ownComponentName, Choropleth);	// End of SDK
		sap.zen.Dispatcher.instance.resumeDispatching();
	 });//End of Require Callback 	
})();// End of closure