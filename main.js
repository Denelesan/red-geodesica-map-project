document.addEventListener('DOMContentLoaded', init)

// Leaflet map
function init(){

    // 1.- CREAR INSTANCIA DE NUESTRO OBJETO MAPA

            // Crear Basemaps

    var openStreetMap= L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

    const map =  L.map("map", {
        center: [-33.45, -70.65],
        zoom: 10,
        layers: smoothDarkMap
        
    })

    L.control.scale().addTo(map);

    const baseMaps = {
        "<b>Smooth Dark Map</b>": smoothDarkMap,
        "OpenStreetMap": openStreetMap,
        "World Imagery Map": worldImageryMap

    }

    const layerControl = L.control.layers(baseMaps,{},{
        collapsed:true
    }).addTo(map)



    //PARA MOSTRAR U OCULTAR SECCIÓN DE MONOGRAFÍA
    document.getElementById("toggleButton").addEventListener("click", function() {
        var map = document.getElementById("map");
        var mono = document.getElementById("mono");
        
        if (mono.style.display === "none" || mono.style.display ==="") {
            mono.style.display = "inline-block";
          
            
        } else {
            //map.style.display = "none";
            mono.style.display = "none";
           
        }
    });

}

    // FUNCTION TRAER INFO WFS RED GEODESICA

    //1.- Se configura variable de WFS a importar

    const urlWFSRedGeodesica = ''+
                                ''+
                                ''

    //2.- Functión para gestionar la petición y la respuesta desde un servicio WFS
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

    //Función para agregar data de WFS a mapa y layer control.
    function addWFSData (WFSData, layerName){
        let WFSLayer = L.geojson(WFSData,{
            onEachFeature: function(feature, layer){
                layer.bindPopup(feature.properties)
            }
        })

        layerControl.addOverlay(WFSLayer, layerName)

    }


    async function getRedGeodesica () {
        const response = await fetch("url");
        const redGeodesica = response.json();
    }