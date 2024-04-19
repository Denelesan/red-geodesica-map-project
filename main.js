document.addEventListener('DOMContentLoaded', init)

// Leaflet map
function init(){

    // 1.- CREAR INSTANCIA DE NUESTRO OBJETO MAPA

            // Crear CRS

            // Obtención del CRS EPSG:25830.
    const crs32719 = new L.Proj.CRS('EPSG:32719',
            '+proj=utm +zone=19 +south +datum=WGS84 +units=m +no_defs', //https://spatialreference.org/ref/epsg/32719/proj4.txt
                    {
                        resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5],
                //Origen de servicio teselado
                origin:[0,0]
                    });

    var crs25830 = new L.Proj.CRS('EPSG:25830',
        '+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs', //http://spatialreference.org/ref/epsg/25830/proj4/
        {
            resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5],
            //Origen de servicio teselado
            //origin:[0,0]
        });

    
                    
    var crsUTM84 = '+proj=utm +zone=19 +south +datum=WGS84 +units=m +no_defs +type=crs';
    var crs3857 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs';     
    // Crear Basemaps

    var openStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

    var smoothDarkMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 20,
        
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
    });

    var worldImageryMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Main Function

    var map = new L.map("map", {
        center: [-33.45, -70.65],
        //center: [40.965, -5.664],
        //center:[6307478,342560],
        zoom: 10,
        continuousWorld:true,
        worlCopyJump:false,
        layers: smoothDarkMap,
        //crs: crs32719
    })
    map.doubleClickZoom.disable()

    var layerRasterIgn = new L.tileLayer.wms("http://www.ign.es/wms-inspire/mapa-raster",
    {
       layers: 'mtn_rasterizado',
       crs: crs25830,
       format: 'image/png',
       continuousWorld: true,
       transparent: true,
       attribution: '© Instituto Geográfico Nacional de España'
})//.addTo(map)


  
 

    L.control.scale().addTo(map);

    const baseMaps = {
        "<b>Smooth Dark Map</b>": smoothDarkMap,
        "OpenStreetMap": openStreetMap,
        "World Imagery Map": worldImageryMap

    }

    const layerControl = L.control.layers(baseMaps,{},{
        collapsed:true
    })

    layerControl.addTo(map)
    
    /*var searchControl = L.esri.Geocoding.geosearch({
        position: 'topleft',
        placeholder: 'Ingresa tu dirección',
        providers: [
            L.esri.Geocoding.arcgisOnlineProvider({
              // API Key to be passed to the ArcGIS Online Geocoding Service
              apikey: 'AAPK33278ae79220431da7d58b5529aa5e13dyVeaAC8qyhFH0s5uNBUXU1s1MeSbOWgn6-DMco7Vw6ocNfzq-ZfstbUQhIiNRQR'
            })
          ]
    }).addTo(map)

    var osmGeocoder = new L.Control.OSMGeocoder({
        placeholder:"Ingresa tu dirección",
        collapsed:true
    })*/

    //map.addControl(osmGeocoder)*/

    var leafletControlGeocoder = L.Control.geocoder({
        placeholder:"Ingresa tu dirección",
        position: "topleft"
    })

    leafletControlGeocoder.addTo(map)
    
   

    function monoDisplay(feature){
        {
            
            var mono = document.getElementById("mono");
            var imagenMono = document.getElementById("monografia-vertice")
            
            if (mono.style.display === "none" || mono.style.display ==="") {
                mono.style.opacity = "1";
                mono.style.display = "inline-block";
                
                imagenMono.setAttribute("src","./imagenes/monografias/"+ feature.properties.nombre_punto + ".jpg") 
                //mono = mono.replace("ruta", feature.properties.nombre_punto+".jpeg");
                console.log(mono,feature.properties.nombre_punto )
                
                
            } else {
                //map.style.display = "none";
                mono.style.opacity = "0"; // Ocultar suavemente la ventana emergente
                setTimeout(function() {
                    mono.style.display = "none";
                }, 300); // Esperar a que termine la transición antes de ocultar definitivamente la ventana emergente
            
                
            }
        }
    }

    function buscarLocalizacion(e) {
        var mydate = new Date(e.timestamp);
        L.marker(e.latlng).addTo(map).bindPopup(mydate.toString());
        }
        function errorLocalizacion(e) {
        alert("No es posible encontrar su ubicación. Es posible que tenga que activar la Geolocation.");
}
        map.on('locationerror', errorLocalizacion);
        map.on('locationfound', buscarLocalizacion);
        map.locate({});


   // FUNCION DE VERTICE MAS CERCANO
   //var puntoMasCercano
   var vertexLocationFound;
   var markerVertexLocationFound;
    function findNearestVertex(coord) {
        if(vertexLocationFound){
            vertexLocationFound.remove()
            markerVertexLocationFound.remove()
        }
        var puntoMasCercano = L.GeometryUtil.closestLayer(map, WFSLayer.getLayers(), coord)
        vertexLocationFound = L.circle(puntoMasCercano.latlng, {radius:100})
        console.log(puntoMasCercano)
        markerVertexLocationFound = L.marker(puntoMasCercano.latlng,{icon:L.divIcon({className:'marker-transparent'})})
        var textLocationFound = `<b>${puntoMasCercano.layer.feature.properties.nombre_punto}</b>`
        
        
        markerVertexLocationFound.addTo(map)
        markerVertexLocationFound.bindTooltip(textLocationFound,{ permanent: true, className: "map-label", offset: [20, 0] }).openTooltip()
        vertexLocationFound.addTo(map)
        //rutaMasCercana( puntoMasCercano.latlng,coord)
        map.flyTo(puntoMasCercano.latlng, 17)

    }
  
    function rutaMasCercana (ubicacionProyecto, verticeMasCercano){
        L.Routing.control({
            waypoints: [
                ubicacionProyecto,
                verticeMasCercano
            ],
            routeWhileDragging: true,
            showAlternatives: true,
            altLineOptions: {
                      styles: [
                            {color: 'black', opacity: 0.2, weight: 9},
                            {color: 'white', opacity: 0.8, weight: 6},
                            {color: 'blue', opacity: 0.5, weight: 2}
    ]
                      },
          }).addTo(map);

    }
    

    // FUNCTION TRAER INFO WFS RED GEODESICA

    //1.- Se configura variable de WFS a importar
    //http://10.13.5.43:443/geoserver/serviu/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=serviu:vw_vertices_geodesicos_vigentes&outputFormat=application%2Fjson

    const urlWFSRedGeodesica = 'http://163.247.53.138:443/geoserver/serviu/wfs?' +
                                'service=wfs&' +
                                'version=2.0.0&' +
                                'request=GetFeature&' +
                                'typeNames=serviu:vw_vertices_geodesicos_vigentes&' +                            
                                'outputFormat=application%2Fjson'

    //2.- Functión para gestionar la petición y la respuesta desde un servicio WFS
    var WFSLayer;
    function fetchWFSData(url, layerName){
        fetch(url,{
            method:'GET',
            mode: 'cors'
        })
        .then(function(response){
            if(response.status ==200){
                
                return response.json(response)
            } else{
                throw new Error ("Fetch API could not fetch the data")
            }
        })
        .then (function(geojson){
            addWFSData(geojson,layerName)
        })
        .catch(function(error){
            console.log(error)
        })
    }
    
    const iconRedGeodesica = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [15, 25],
        iconAnchor: [18, 18],
        popupAnchor: [1, -34],
        shadowSize: [31, 31]
      });

    // Functión para popup tabla de Red geodésica
    var popup = L.popup()
    function tablaPopUpRedGeodesica(feature, layer) {                                
        layer.on('click', function(e) {    
            fetch("table.html")
                .then(response =>{
                    if (!response.ok){
                        throw new Error ("No se pudo cargar la plantilla")
                    }
                    return response.text()
                    
                })
                .then (tableHTML =>{
                    tableHTML = tableHTML.replace("nombre_punto", feature.properties.nombre_punto);
                    tableHTML = tableHTML.replace("vertice_intervisible", "No cuenta");
                    tableHTML = tableHTML.replace("estado", feature.properties.estado);
                    tableHTML = tableHTML.replace("este", feature.properties.este +" m");
                    tableHTML = tableHTML.replace("norte", feature.properties.norte+ " m");
                    tableHTML = tableHTML.replace("cota", feature.properties.cota_nmm +" m");
                    tableHTML = tableHTML.replace("alturaElipsoidal", feature.properties.altura_elipsoidal +" m");
                    tableHTML = tableHTML.replace("alturaOrtometrica", feature.properties.altura_geoidal +" m");
                    tableHTML = tableHTML.replace("sistemaDeReferencia", feature.properties.sistema_referencia);
                   
               
                
                popup.setContent(tableHTML)
                
                popup.setLatLng(e.latlng);
                
                popup.openOn(map)

                
                                              
                //PARA MOSTRAR U OCULTAR SECCIÓN DE MONOGRAFÍA
                
                    var toggleButton = document.getElementById("toggleButton")
            
                    toggleButton.addEventListener("click", function(){
                        monoDisplay(feature)});
            
                
                
                map.on("popupclose", function(e){
                    
                    
                    if (mono.style.display === "inline-block")
                        {monoDisplay()}
                    })
                })
                
                .catch (error =>{
                    console.log("Error", error)
                })
            
        })     
    }


    //Función para agregar data de WFS a mapa y layer control.
    
    function addWFSData (WFSData, layerName){
        WFSLayer = L.geoJSON(WFSData,{
            /*coordsToLatLng: function(coords){
                let longlat = (proj4(crsUTM84).inverse([coords[0],coords[1]]))
                //console.log(longlat[1],longlat[0])
                return new L.LatLng(longlat[1],longlat[0])
            },*/
            pointToLayer : function(coords){
                let coordinatesUTM = coords.geometry.coordinates
                
                let coordinatesGeographicReverse = (proj4(crsUTM84).inverse([coordinatesUTM[0],coordinatesUTM[1]]))
                let coordinatesGeographic = [coordinatesGeographicReverse[1],coordinatesGeographicReverse[0]]
                return L.marker(coordinatesGeographic,{icon: iconRedGeodesica})
            },
            onEachFeature: tablaPopUpRedGeodesica
        }).addTo(map)
        var currentZoom = map.getZoom();
        console.log(currentZoom)       
        layerControl.addOverlay(WFSLayer, layerName)
        configureSearchControl()
        //WFSLayerGroup = L.layerGroup([WFSLayer]);
       
    }

    
    

    //console.log("Las Coordenadas de 84 son "+proj4(crsUTM84).inverse([342560,6307478]))

    fetchWFSData(urlWFSRedGeodesica,"Red Geodésica")
    
    function handleButtonClick(){
        console.log("handle")
        findNearestVertex(coordinateGeographicDblClick);
    }
   
   /* map.on("click", function(e){
        console.log(proj4(crsUTM84,[e.latlng.lng,e.latlng.lat]))
    })*/

    //Función para crear marker con evento de doble click en el mapa

    
    //var popupUbicacionProyecto 
    var markerDblClick;
    var markerData
    var coordinateGeographicDblClick 

    map.on("dblclick", function(e){

        // Crear el botón
        var button = document.createElement('button');
        button.id = "button-vertice-cercano";
        button.className = "btn btn-primary";
        button.type = "button";
        button.textContent = "Vértice más cercano";

        // Asignar el evento de clic al botón
        button.addEventListener("click", handleButtonClick);
       
        if (markerDblClick ){
            markerDblClick.off('popupopen'); // Eliminar el evento asociado al abrir el popup
            markerDblClick.off('popupclose'); // Eliminar el evento asociado al cerrar el popup
            markerDblClick.remove(); // Eliminar el marcador del mapa
            markerDblClick = null; // Limpiar la referencia al marcador
            
        }
        
        coordinateGeographicDblClick = e.latlng
        markerData={
            title:"Ubicación del Proyecto",
            ubicacion: `<b>Lat:</b>${coordinateGeographicDblClick.lat} <b>Long:</b>${coordinateGeographicDblClick.lng}`
        }
        var popupUbicacionProyecto = document.createElement('div');
        popupUbicacionProyecto.innerHTML= `
        <div>
            
            <div id="popupUbicacionProyecto">
                <b>${markerData.title}</b>
            </div>
            <p>${markerData.ubicacion}</p>
            
            <div id="button-separator">
            
            </div>
        </div>`;
        popupUbicacionProyecto.querySelector('#button-separator').appendChild(button);
         
        
        markerDblClick = L.marker(coordinateGeographicDblClick)
        markerDblClick.bindPopup(popupUbicacionProyecto)
        markerDblClick.addTo(map)
        markerDblClick.openPopup()
        
                })
        
    // search para buscar en capas de vértices
    var circleLocationFound
    var zoomToShowTooltip = 18
    var markerLocationFound
    function configureSearchControl(){
        if(WFSLayer){
            controlSearch =  new L.Control.Search({
                position:'topright',
                textPlaceholder: "Busca un vértice Geodésico",
                
                layer:WFSLayer,
                propertyName: 'nombre_punto',
                initial:false,
                zoom:zoomToShowTooltip,
                marker:false
            })
            map.addControl(controlSearch)

            controlSearch.on('search:locationfound', function(e){
                if(circleLocationFound){
                    circleLocationFound.remove()
                    markerLocationFound.remove()
                }
                let latLocationFound=e.layer._latlng.lat
                let lngLocationFound=e.layer._latlng.lng
                markerLocationFound = L.marker([latLocationFound,lngLocationFound],{icon:L.divIcon({className:'marker-transparent'})})
                var textLocationFound = `<b>${e.text}</b>`
                
                circleLocationFound = L.circle([latLocationFound,lngLocationFound], {radius:100})
                markerLocationFound.addTo(map)
                markerLocationFound.bindTooltip(textLocationFound,{ permanent: true, className: "map-label", offset: [20, 0] }).openTooltip()
                circleLocationFound.addTo(map)
            })

            
        }else{
            console.log("WFSLayer is not defined yet")
        }
    }
    map.on('moveend', function(){
        
        if(circleLocationFound){
            let boundsNow= map.getBounds();
        
            if(!boundsNow.contains(circleLocationFound.getLatLng())){
                circleLocationFound.remove()
                
               
                if (markerLocationFound){
                    markerLocationFound.unbindTooltip()
                    markerLocationFound.remove()
                }
                
            }
        } if (vertexLocationFound){
            let boundsNow= map.getBounds();
            
            if(!boundsNow.contains(vertexLocationFound.getLatLng())){
                vertexLocationFound.remove()
                if (markerVertexLocationFound){
                    markerVertexLocationFound.unbindTooltip()
                    markerVertexLocationFound.remove()
                }
            }
        }

  }
        
    )
    
    
   /* map.on("click", function (e){
        var puntoMasCercano = L.GeometryUtil.closestLayer(map, WFSLayer.getLayers(), e.latlng)
        console.log(WFSLayer.getLayers())
        console.log(puntoMasCercano.latlng)

        map.flyTo(puntoMasCercano.latlng, 18)
    })*/
    
     
   
}