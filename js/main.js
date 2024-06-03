/* In JS, the $ in the variable name is only part of the name, but the convention is to use it to start variable names when the variable represents a jQuery object.
var $myHeaderDiv = $('#header');
var myHeaderDiv = document.getElementById('header');
$myHeaderDiv.hide();
var $myHeaderDiv = $('#header');
var myHeaderDiv = document.getElementById('header');
*/
console.print = function (...args) {queueMicrotask (console.log.bind (console, ...args));};
  let prnt,vLogonTokenLocalStorage,vConnectedUser,vConnectedCMS,vSelectedViewID;
  const vHTMLLogoandUser = '<a class="cNavAppLogo" href="index.html"><span id="iAppLogo"></span></a><a id="iConnectedUser"></a>';
  const vHTMLVer = '<div id="iAppVer"></div>';
  const vAppName = 'BI Platform Insight';
  const vAppVer = 1.0;
  const vHTMLViewContent = `<div>
  <h1 id="iViewDescription"></h1>
  <div id="iViewActions"></div>
  <div id="iViewStats"></div>
  <div class="cView">
    <table id="iViewTable" class="cViewTable"></table>								
  </div>
  <div id="iLoader" class="cLoader">   
    <img src="img/loader.gif" alt="Loading"/>Processing your request.&nbsp;Refresh to cancel.
  </div>
</div>`;
  const vHTMLFooter = `<footer class="cFooter">
  <div id="iFooter">
    <a href="http://nikhilnair.in/" target="_blank">Copyright &copy; 2020 - ${new Date().getFullYear()} Nikhil Nair </a> <a>|</a>
    <a href="#" target="_blank">GitHub</a><a>|</a>
    <a href="#" target="_blank">Support</a><a>|</a>
    <a href="#" target="_blank">Feedback</a><a>|</a>
    <a href="#" target="_blank">Terms of Use</a>
  </div>
</footer>`;
vLogonTokenLocalStorage = window.localStorage.getItem("lgntkn");
vConnectedUser = window.localStorage.getItem("lgntkn") ? (vLogonTokenLocalStorage.substring(vLogonTokenLocalStorage.indexOf("secEnterprise:")+"secEnterprise:".length)).substring(0,(vLogonTokenLocalStorage.substring(vLogonTokenLocalStorage.indexOf("secEnterprise:")+"secEnterprise:".length)).indexOf(",")) : '';
vConnectedCMS = window.localStorage.getItem("lgntkn") ? vLogonTokenLocalStorage.substring(0,vLogonTokenLocalStorage.indexOf("@")) : '';        


  // URL Variables
  const vBaseURL = 'biprws';
  const vLogonU = 'logon/long';
  const vQueryU = 'v1/cmsquery';
  const vQueryAttribStart = '<attrs xmlns=\"http://www.sap.com/rws/bip\">\r\n <attr name=\"query\" type=\"string\">';
  const vQueryAttribEnd = '</attr>\r\n </attrs>';

  // Header Variables
  // const gethdr = {"X-SAP-LogonToken": window.localStorage.getItem("lgntkn"),"Accept": "application/json"};
  const vPOSTHeader = {"Content-Type": "application/xml","Accept": "application/json"};
  const vGETHeader= {"X-SAP-LogonToken": window.localStorage.getItem("lgntkn"),"Accept": "application/json"};
  // function testas() {return vPOSTHeaderWithToken};
  
  // View Variables
  ////servers
  const vQuery4AllServers = "select SI_CUID, SI_ID,SI_NAME,SI_SIA_HOSTNAME,SI_STATUSINFO,SI_SERVER_KIND,SI_DISABLED,SI_UPDATE_TS from ci_systemobjects where si_kind = \'Server\' order by SI_SERVER_KIND asc";
  const vQuery4AllServersCMDLine = "select SI_NAME,SI_CURRENT_COMMAND_LINE from ci_systemobjects where si_kind = \'Server\' order by SI_SERVER_KIND asc";
  const vQuery4AllAPS = "select SI_NAME,SI_CURRENT_COMMAND_LINE,SI_METRICS from ci_systemobjects where si_kind = \'Server\' and SI_SERVER_KIND = \'pjs\' order by SI_SIA_HOSTNAME asc";

  ////Universes
  const vQuery4AllUNX = "select SI_ID,SI_CUID,SI_NAME,SI_SL_DOCUMENTS,SI_SL_UPDATE_TS,SI_SL_UNIVERSE_TO_CONNECTIONS from ci_appobjects where SI_SPECIFIC_PROGID	= \'CrystalEnterprise.DSL.Universe\'";
  const vQuery4AllUNV = "select SI_ID,SI_CUID,SI_NAME,SI_WEBI,SI_UPDATE_TS from ci_appobjects where si_kind = \'universe\'";

  ////Connections
  const vQuery4AllRelationalCXN = "select SI_ID,SI_CUID,SI_NAME,SI_CONNECTION_DATABASE,SI_CONNECTION_NETWORKLAYER,SI_CONNECTION_USES_SSO,SI_CONNUNIVERSE,SI_FHSQL_WEBI_DOCUMENT,SI_UPDATE_TS from ci_appobjects where SI_SPECIFIC_PROGID = \'CrystalEnterprise.CCIS.DataConnection\' and SI_CONNECTION_IS_OLAP = 0";
  const vQuery4AllBAPICXN = "select SI_ID,SI_CUID,SI_NAME,SI_CONNECTION_DATABASE,SI_CONNECTION_NETWORKLAYER,SI_CONNECTION_USES_SSO,SI_CONNUNIVERSE,SI_FHSQL_WEBI_DOCUMENT,SI_UPDATE_TS from ci_appobjects where SI_SPECIFIC_PROGID = \'CrystalEnterprise.CCIS.DataConnection\' and SI_CONNECTION_IS_OLAP = 1";
  const vQuery4AllOLAPCXN = "select SI_ID,SI_CUID,SI_NAME,SI_CONNECTION_TYPE,SI_CUBE_CAPTION,SI_DESCRIPTION,SI_DOCUMENT,SI_NETWORK_LAYER,SI_PROVIDER_CAPTION,SI_SERVER,SI_UPDATE_TS,SI_CATALOG_CAPTION,SI_UPDATE_TS from ci_appobjects where SI_SPECIFIC_PROGID = \'CrystalEnterprise.CommonConnection\'";
  
  ////Auth
  const vQuery4AllHANASAMLAUTHCXN = "select SI_ID,SI_CUID,SI_NAME,SI_CONN_TYPE,SI_HOST,SI_IDENTIFY_PROVIDER_ID,SI_INSTANCE_NUMBER,SI_PORT,SI_SECURE_CONN,SI_SP_ID,SI_TENANT_DATABASE,SI_UPDATE_TS from ci_systemobjects  where SI_OBTYPE = 326";
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  // HTML Element 
  const vViewDescriptionID = "#iViewDescription";
  const vViewActionsID = "#iViewActions";
  const vHTMLViewButton = '<button id="iViewButton">View</button>';
  let vHTMLRowLimitInputField = '<em>Row limit: <input type="number" id="iRowLimit" value="100" maxlength="3" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"> rows</em>';
  let vHTMLHideShowColumns = `<em>Show/Hide Columns:</em>&nbsp;
  <button id="iShowHideCUID" class="cButton">CUID</button>&nbsp;
  <button id="iShowHideID" class="cButton">ID</button>`;
  const vViewStatsID = "#iViewStats";
  const vViewClass = ".cView";
  const vLoaderID = "#iLoader";  

  
  const vHTMLResponseTimeLabel = '<b>Response Time:</b>';
  const vHTMLTotalRowsLabel = '<b>Total Rows:</b>';
  const vViewTableID = "#iViewTable";
  const h={s:"<thead><tr>",e:"</tr></thead>",no:"<th>#</th>",cuid:"<th>CUID</th>",id:"<th>ID</th>",name:"<th>Name</th>",rpt_cnt:"<th>Report Count</th>",state:"<th>State</th>",enabled:"<th>Enabled?</th>",host:"<th>Host</th>",desc:"<th>Description</th>",up_ts:"<th>Last Updated On</th>",cmd:"<th>Command Line</th>",xms:"<th>Min. Heap Size (Xms)</th>",xmx:"<th>Max. Heap Size (Xmx)</th>",svc:"<th>Included Services</th>",cxn_cnt:"<th>Connection Count</th>",db_drv:"<th>DB Driver Type</th>",db:"<th>Database</th>",sso:"<th>SSO?</th>",unv_cnt:"<th>Universe Count</th>",fhsql_cnt:"<th>FHSQL Report Count</th>",cxn_typ:"<th>Con. Type</th>",cube_cap:"<th>Cube Caption</th>",srv:"<th>Server</th>",ctlg_cap:"<th>Catalog Caption</th>",cxn:"<th>Connection</th>",idp:"<th>IDP</th>",port:"<th>Port</th>",ssl:"<th>SSL?</th>",sp:"<th>SP Name</th>",tnt:"<th>Tenant</th>",typ:"<th>Type</th>"};
  const vHTMLErrorMessage = '"<tr>" + "<td>" + "Error: " + "data.status" + "&nbsp;" + "data.responseJSON" + "</td>" + "</tr>";'
  
  // Functions
  function fnDisplayViewDescription (pViewLinkID) {
    switch (pViewLinkID) {
      // Servers
      case 'iServerStatusLink': return 'Display the complete list of servers in the cluster along with its running status, enablement status, host and type.'; break;
      case 'iServerCommandLineLink': return 'Display the command-line parameters of all the servers in the cluster.'; break;
      case 'iServerAPSLink': return 'Display all Adaptive Processing Servers (APS) with their current properties.'; break;    
      // Universes
      case 'iAllUNXLink': return 'Display all Universes (UNX) along with the number of reports based on it and connections used by the universe.'; break;
      case 'iAllUNVLink': return 'Display all Universes (UNV) along with the number of reports based on it.'; break;
      // case 'topunvbyreports_nv': return 'Display the list of Universes and number of report documents created on it'; break;
      //Connections
      case 'iAllRelConLink': return 'Display all relational universe connections with their properties.'; break;
      case 'iAllBAPILink': return 'Display all UNV (BAPI) universe connections with their properties.'; break;
      case 'iAllOLAPLink': return 'Display all OLAP connections with their properties.'; break;
      //Auth
      case 'iAllHANASAMLAuthLink': return 'Display all HANA SAML authentication connections.'; break;
    }
  };
  function fnInitLoader() {
    // console.log("Loader Init");
    $(vViewClass).hide();
    $(vViewStatsID).hide();
    $(vLoaderID).css({"display": "flex"});
   };
   function fnCloseLoader() {
    $(vLoaderID).css({"display": "none"});
    $(vViewStatsID).show();
    $(vViewClass).show();
    // console.log("Loader Close");
   };

/*
  Message Codes
  INF20010 = HTTP 200. statusCode 200 triggered.
  INF40110 = HTTP 401. statusCode 401 triggered.
  INF40410 = HTTP 404. statusCode 404 triggered.
*/
   function fnDisplayDetailedErrorMessage(pHTTPStatusCode) {
    switch (pHTTPStatusCode) {
      case 200:fnCloseLoader();prnt = "INF20010";break;
      case 401:fnCloseLoader();$(vViewTableID).empty().append(vHTMLHTTP401);prnt += "INF40110";break;
      case 404:fnCloseLoader();$(vViewTableID).empty().append(vHTMLHTTP404);prnt += "INF40410";break;
      case 500:fnCloseLoader();$(vViewTableID).empty().append(vHTMLHTTP500);prnt += "INF50010";break;
    }};
  let stime, etime;
  function fnCurrentTimeStamp() {let a = new Date().getTime();return a;};  

  function fnLoadView(pViewLinkID) {
    $(vViewDescriptionID).empty().html(fnDisplayViewDescription(pViewLinkID));
    $(vViewActionsID).empty().html(`${vHTMLViewButton} | ${vHTMLRowLimitInputField} | ${vHTMLHideShowColumns} `);
    $(vViewTableID).empty();
    $(vViewStatsID).empty();
    fnCloseLoader();
  };
  
  // Error Messages for HTTP Codes
  const vHTMLHTTP401 = '<tr><td style="color:red;">Error: HTTP 401 Unauthorized: Account information not recognized: Please make sure your logon information is correct. (FWB 00008)</td></tr>';
  const vHTMLHTTP404 = '<tr><td style="color:red;">Error: HTTP 404 Check Restful URL</td></tr>';
  const vHTMLHTTP500 = '<tr><td style="color:red;">Error: HTTP 500 Server failed to process the request. Try again.</td></tr>';


  //Common AJAX Settings
  $.ajaxSetup({
    cache: false,
    statusCode: {
      200: function() {fnDisplayDetailedErrorMessage(200)},
      401: function() {fnDisplayDetailedErrorMessage(401)},
      404: function() {fnDisplayDetailedErrorMessage(404)},
      500: function() {fnDisplayDetailedErrorMessage(500)},
    },
    complete: function(e, xhr, settings){
      console.print(prnt);
    }
  });

  function fRQ(p) {
    let vData,vTH;
  
    function serverStatusCount(data) {
      const o = data.entries;
      let running,stopped,other,enabled,disabled;
      running=stopped=other=enabled=disabled = 0;
      for (let i = 0; i < o.length; i++) {
      const { SI_STATUSINFO,SI_DISABLED } = o[i];
      if (SI_STATUSINFO.SI_STATUS === 3) {running++} else if (SI_STATUSINFO.SI_STATUS === 0) {stopped++} else {other++};
      if (SI_DISABLED === false) {enabled++} else {disabled++};    }
      return {running: running,stopped: stopped,other: other,enabled: enabled,disabled: disabled};
    };
  
    switch (p) {
      //Servers
      case 'allsrv': vData = vQueryAttribStart + vQuery4AllServers + vQueryAttribEnd;
      vTH = `${h.s} + ${h.no} + ${h.cuid} + ${h.id} + ${h.name} + ${h.state} + ${h.enabled} + ${h.host} + ${h.typ} + ${h.up_ts} + ${h.e}`;break;    
      case 'allsrvcmd': vData = vQueryAttribStart + vQuery4AllServersCMDLine + vQueryAttribEnd;
      vTH = `${h.s} + ${h.no} + ${h.name} + ${h.cmd} + ${h.e}`;break;
      case 'allaps': vData = vQueryAttribStart + vQuery4AllAPS + vQueryAttribEnd;
      vTH = `${h.s} + ${h.no} + ${h.name} + ${h.xms} + ${h.xmx} + ${h.svc} + ${h.e}`;break;
  
      //Semantic
      case 'allunx': vData = vQueryAttribStart + vQuery4AllUNX + vQueryAttribEnd;
      vTH = `${h.s} + ${h.no} + ${h.cuid} + ${h.id} + ${h.name} + ${h.rpt_cnt} + ${h.cxn_cnt} + ${h.up_ts} + ${h.e}`;break;
      case 'allunv': vData = vQueryAttribStart + vQuery4AllUNV + vQueryAttribEnd;
      vTH = `${h.s} + ${h.no} + ${h.cuid} + ${h.id} + ${h.name} + ${h.rpt_cnt} + ${h.up_ts} + ${h.e}`;break;
      
      //Connections
      case 'allrel': vData = vQueryAttribStart + vQuery4AllRelationalCXN + vQueryAttribEnd;
      vTH = `${h.s} + ${h.no} + ${h.cuid} + ${h.id} + ${h.name} + ${h.db_drv} + ${h.db} + ${h.sso} + ${h.unv_cnt} + ${h.fhsql_cnt} + ${h.up_ts} + ${h.e}`;break;
      case 'allbapi': vData = vQueryAttribStart + vQuery4AllBAPICXN + vQueryAttribEnd;
      vTH = `${h.s} + ${h.no} + ${h.cuid} + ${h.id} + ${h.name} + ${h.db_drv} + ${h.db} + ${h.sso} + ${h.unv_cnt} + ${h.up_ts} + ${h.e}`;break;
      case 'allolap': vData = vQueryAttribStart + vQuery4AllOLAPCXN + vQueryAttribEnd;
      vTH = `${h.s} + ${h.no} + ${h.cuid} + ${h.id} + ${h.name} + ${h.cxn_typ} + ${h.cube_cap} + ${h.db} + ${h.desc} + ${h.rpt_cnt} + ${h.srv} + ${h.ctlg_cap} + ${h.up_ts} + ${h.e}`;break;
      
      //Auth
      case 'allhanasaml': vData = vQueryAttribStart + vQuery4AllHANASAMLAUTHCXN + vQueryAttribEnd;
      vTH = `${h.s} + ${h.no} + ${h.cuid} + ${h.id} + ${h.cxn} + ${h.cxn_typ} + ${h.idp} + ${h.port} + ${h.ssl} + ${h.sp} + ${h.tnt} + ${h.up_ts} + ${h.e}`;break;        
    }
    fnInitLoader();
    ts = fnCurrentTimeStamp();
    $.ajax({
      url: `/${vBaseURL}/${vQueryU}?page=1&pagesize=${$("#iRowLimit").val()}`,
      type: "POST",
      headers: {"Content-Type": "application/xml","Accept": "application/json","X-SAP-LogonToken": window.localStorage.getItem("lgntkn")},
      data: vData,
      success: function(data) {
        te = fnCurrentTimeStamp();
        const t = te - ts;
        const d = data.entries;
        const l = d.length;
        $(vViewStatsID).empty().html(`${vHTMLResponseTimeLabel} ${t} ms | ${vHTMLTotalRowsLabel} ${l}`);
        switch(p) {
          //Servers
          case 'allsrv':
            const {running,stopped,other,enabled,disabled} = serverStatusCount(data);
            $(vViewStatsID).empty().html(`${vHTMLResponseTimeLabel} ${t} ms | ${vHTMLTotalRowsLabel} ${l} | <b>Services:</b> <a style="background: lightgreen;"><i>Running: ${running} </a>, <a style="background: lightcoral;">Stopped: ${stopped} </a>, <a style="background: lightcoral;">Disabled: ${disabled}  </a>.</i>`);
            $(vViewTableID).empty().append(`${vTH}`);
            for (let i = 0; i < l; i++) {
              const rn = i + 1;
              const { SI_CUID, SI_ID,SI_NAME,SI_SIA_HOSTNAME,SI_STATUSINFO,SI_DISABLED,SI_SERVER_KIND,SI_UPDATE_TS } = d[i];
              let statusCheck,enabled;
              if (SI_STATUSINFO.SI_STATUS === 3) {statusCheck = "Running"} else 
              if (SI_STATUSINFO.SI_STATUS === 0) {statusCheck = "Stopped"} else 
              if (SI_STATUSINFO.SI_STATUS === 1) {statusCheck = "Starting"};
              SI_DISABLED === false ? enabled = "Enabled" : enabled = "Disabled";
              switch (SI_SERVER_KIND) {
                case 'aps':vServerKind = 'Central Management Server';break;
                case 'cacheserver':vServerKind = 'CR Cache Server';break;
                case 'pjs':vServerKind = 'Adaptive Processing Server';break;
                case 'connectionserver':vServerKind = 'Connection Server';break;
                case 'eventserver':vServerKind = 'Event Server';break;
                case 'fileserver':vServerKind = 'File Repository Server';break;
                case 'jobserver':vServerKind = 'Adaptive Job Server';break;
                case 'pageserver':vServerKind = 'CR Processing Server';break;
                case 'rptappserver':vServerKind = 'Report Application Server';break;
                case 'webiserver':vServerKind = 'Web Intelligence Processing Server';break;};
              $(vViewTableID).append(`<tr><td>${rn}</td><td>${SI_CUID}</td><td>${SI_ID}</td><td>${SI_NAME}</td><td>${statusCheck}</td><td>${enabled}</td><td>${SI_SIA_HOSTNAME}</td><td>${vServerKind}</td><td>${SI_UPDATE_TS}</td></tr>`);
              $("td").addClass("rstatus");
              $('.rstatus:contains("Running"), .rstatus:contains("Enabled")').css('background', 'lightgreen');
              $('.rstatus:contains("Stopped"), .rstatus:contains("Disabled")').css('background', 'lightcoral');
            };
            break;
            case 'allsrvcmd':
              $(vViewActionsID).empty().html(`${vHTMLViewButton} | ${vHTMLRowLimitInputField}`);
              $(vViewTableID).empty().append(`${vTH}`);
              for (let i = 0; i < l; i++) {
                const rn = i + 1;
                const {SI_NAME,SI_CURRENT_COMMAND_LINE} = d[i];
                $(vViewTableID).append(`<tr><td>${rn}</td><td>${SI_NAME}</td><td>${SI_CURRENT_COMMAND_LINE}</td></tr>`);
              }
              break;
            case 'allaps':
              $(vViewActionsID).empty().html(`${vHTMLViewButton} | ${vHTMLRowLimitInputField}`);
              $(vViewTableID).empty().append(`${vTH}`);
              for (let i = 0; i < l; i++) {
                const rownum = i + 1;
                const {SI_NAME,SI_CURRENT_COMMAND_LINE,SI_METRICS} = d[i];
    
                let pjsAdmMet,svclist;
                for (const value in SI_METRICS) { 
                  let x = SI_METRICS[value].SI_NAME; 
                  (x === "PJSAdmin") ? pjsAdmMet = SI_METRICS[value].SI_METRICS:'';
                };
                for (const x in pjsAdmMet) {
                  let a = pjsAdmMet[x].SI_NAME;
                  (a === "HOSTED_SERVICES") ? svclist = pjsAdmMet[x].SI_VALUE : '';
                };  
                let xms = SI_CURRENT_COMMAND_LINE.substring(SI_CURRENT_COMMAND_LINE.toUpperCase().indexOf("XMS")+3).substring(SI_CURRENT_COMMAND_LINE.substring(SI_CURRENT_COMMAND_LINE.toUpperCase().indexOf("XMS")+3),SI_CURRENT_COMMAND_LINE.substring(SI_CURRENT_COMMAND_LINE.toUpperCase().indexOf("XMS")+3).indexOf(" "));
                let xmx = SI_CURRENT_COMMAND_LINE.substring(SI_CURRENT_COMMAND_LINE.toUpperCase().indexOf("XMX")+3).substring(SI_CURRENT_COMMAND_LINE.substring(SI_CURRENT_COMMAND_LINE.toUpperCase().indexOf("XMX")+3),SI_CURRENT_COMMAND_LINE.substring(SI_CURRENT_COMMAND_LINE.toUpperCase().indexOf("XMX")+3).indexOf(" "));
                let xmsu = xms.charAt(xms.length-1);
                let xmxu = xmx.charAt(xmx.length-1);
                $(vViewTableID).append(`<tr><td>${rownum}</td><td>${SI_NAME}</td><td>${xms.substring(0,xms.indexOf(xms.charAt(xms.length-1)))} ${(xmsu == 'm') ? "MB":"GB"}</td><td>${xmx.substring(0,xmx.indexOf(xmx.charAt(xmx.length-1)))} ${(xmxu == 'm') ? "MB":"GB"}</td><td>${svclist}</td></tr>`);
              };
              break;
  
          // Semantic
          case 'allunx':$(vViewTableID).empty().append(`${vTH}`);          
                      for (let i = 0; i < l; i++) {
                        let rn = i + 1;
                        const {SI_ID,SI_CUID,SI_NAME,SI_SL_DOCUMENTS,SI_SL_UPDATE_TS,SI_SL_UNIVERSE_TO_CONNECTIONS} = d[i];
                        $(vViewTableID).append(`<tr><td>${rn}</td><td>${SI_CUID}</td><td>${SI_ID}</td><td>${SI_NAME}</td><td class="tc">${SI_SL_DOCUMENTS.SI_TOTAL}</td><td class="tc">${SI_SL_UNIVERSE_TO_CONNECTIONS.SI_TOTAL}</td><td>${SI_SL_UPDATE_TS}</td></tr>`);
                      };
                      break;
          case 'allunv':$(vViewTableID).empty().append(`${vTH}`);
                      for (let i = 0; i < l; i++) {
                        const rn = i + 1;
                        const {SI_ID,SI_CUID,SI_NAME,SI_WEBI,SI_UPDATE_TS} = d[i];
                        $(vViewTableID).append(`<tr><td>${rn}</td><td>${SI_CUID}</td><td>${SI_ID}</td><td>${SI_NAME}</td><td class="tc">${SI_WEBI.SI_TOTAL}</td><td>${SI_UPDATE_TS}</td></tr>`);
                      };
                      break;
          case 'allrel':$(vViewTableID).empty().append(`${vTH}`);
                      for (let i = 0; i < l; i++) {
                        const rn = i + 1;
                        const {SI_ID,SI_CUID,SI_NAME,SI_CONNECTION_DATABASE,SI_CONNECTION_NETWORKLAYER,SI_CONNECTION_USES_SSO,SI_CONNUNIVERSE,SI_FHSQL_WEBI_DOCUMENT,SI_UPDATE_TS} = d[i];
                        $(vViewTableID).append(`<tr><td>${rn}</td><td>${SI_CUID}</td><td>${SI_ID}</td><td>${SI_NAME}</td><td>${SI_CONNECTION_NETWORKLAYER}</td><td>${SI_CONNECTION_DATABASE}</td><td>${(SI_CONNECTION_USES_SSO === false)?"No":"Yes"}</td><td class="tc">${SI_CONNUNIVERSE.SI_TOTAL}</td><td class="tc">${SI_FHSQL_WEBI_DOCUMENT.SI_TOTAL}</td><td>${SI_UPDATE_TS}</td></tr>`);
                      };
                      break;
          case 'allbapi':$(vViewTableID).empty().append(`${vTH}`);
                      for (let i = 0; i < l; i++) {
                        const rn = i + 1;
                        const {SI_ID,SI_CUID,SI_NAME,SI_CONNECTION_DATABASE,SI_CONNECTION_NETWORKLAYER,SI_CONNECTION_USES_SSO,SI_CONNUNIVERSE,SI_UPDATE_TS} = d[i];
                        $(vViewTableID).append(`<tr><td>${rn}</td><td>${SI_CUID}</td><td>${SI_ID}</td><td>${SI_NAME}</td><td>${SI_CONNECTION_NETWORKLAYER}</td><td>${SI_CONNECTION_DATABASE}</td><td>${(SI_CONNECTION_USES_SSO === false)?"No":"Yes"}</td><td class="tc">${SI_CONNUNIVERSE.SI_TOTAL}</td><td>${SI_UPDATE_TS}</td></tr>`);
                      };
                      break;
          case 'allolap':$(vViewTableID).empty().append(`${vTH}`);
                      for (let i = 0; i < l; i++) {
                        const rn = i + 1;
                        const {SI_ID,SI_CUID,SI_NAME,SI_CONNECTION_TYPE,SI_CUBE_CAPTION,SI_DESCRIPTION,SI_DOCUMENT,SI_NETWORK_LAYER,SI_PROVIDER_CAPTION,SI_SERVER,SI_CATALOG_CAPTION,SI_UPDATE_TS} = d[i];
                        $(vViewTableID).append(`<tr><td>${rn}</td><td>${SI_CUID}</td><td>${SI_ID}</td><td>${SI_NAME}</td><td>${SI_CONNECTION_TYPE}</td><td>${SI_CUBE_CAPTION}</td><td>${SI_PROVIDER_CAPTION}</td><td>${SI_DESCRIPTION}</td><td class="tc">${SI_DOCUMENT.SI_TOTAL}</td><td>${SI_SERVER}</td><td>${SI_CATALOG_CAPTION}</td><td>${SI_UPDATE_TS}</td></tr>`);
                      };
                      break;
          case 'allhanasaml':$(vViewTableID).empty().append(`${vTH}`);
                      for (let i = 0; i < l; i++) {
                        const rn = i + 1;
                        const {SI_ID,SI_CUID,SI_CONN_TYPE,SI_HOST,SI_IDENTIFY_PROVIDER_ID,SI_INSTANCE_NUMBER,SI_PORT,SI_SECURE_CONN,SI_SP_ID,SI_TENANT_DATABASE,SI_UPDATE_TS} = d[i];
                        $(vViewTableID).append(`<tr><td>${rn}</td><td>${SI_CUID}</td><td>${SI_ID}</td><td>${SI_HOST}</td><td>${SI_CONN_TYPE}</td><td>${SI_IDENTIFY_PROVIDER_ID}</td><td>${SI_PORT}</td><td class="tc">${(SI_SECURE_CONN === false)?"No":"Yes"}</td><td>${SI_SP_ID}</td><td>${SI_TENANT_DATABASE}</td><td>${SI_UPDATE_TS}</td></tr>`);
                      };
                      break;                    
        };
      },
      error: function (data) {$(vViewTableID).innerHTML = vHTMLErrorMessage;prnt+=" E ";}
    });
  };

  //Document Ready Function Start
  $(function() {

    if ("lgntkn" in window.localStorage) {
      // if logon token (lgntkn) exists in localStorage, check if the token is valid
      $.ajax({
        url: `/${vBaseURL}/v1/timezone`,
        type: "GET",
        headers: vGETHeader,
        timeout: 3000,
        statusCode: {
          200: function() {fnDisplayDetailedErrorMessage(200)},
          401: function() {$("#iLogOffBtn").hide();},// if logon token is NOT valid or validation fails
          404: function() {$("#iLogOffBtn").hide();},// if logon token is NOT valid or validation fails
          500: function() {$("#iLogOffBtn").hide();},// if logon token is NOT valid or validation fails
        },
        success: function(data) {
          // if logon token is valid
          $("#iCMSName").html(`Connected to:  <b style="text-transform: uppercase";> ${vConnectedCMS}</b>"`);
          $("#iConnectedUser").html("&#x2714;" +vConnectedUser);
          $("#iLogOffBtn").show();
        },
      error: function (data) {
        // if logon token is NOT valid or validation fails
        $("#iCMSName").html('<b style="color:red";>Not Connected</b>');
      }
      })
    } else {
      // if logon token (lgntkn) DOES NOT exist in localStorage
      $("#iCMSName").html('<a style="color:red";>Not Connected</a>');
      $("#iLogOffBtn").hide();
    };
  
    $("#iLogOnBtn").click(function() {
      var username = $("#iUsername").val();
      var password = $("#iPassword").val();
      $(vViewStatsID).empty();
      $(vViewTableID).empty();
      fnInitLoader();
      $.ajax({
        url: `/${vBaseURL}/${vLogonU}`,
        type: "POST",
        headers: vPOSTHeader,
        data: "<attrs xmlns=\"http://www.sap.com/rws/bip\">\r\n    <attr name=\"password\" type=\"string\">" + password + "</attr>\r\n    <attr name=\"auth\" type=\"string\" possibilities=\"secEnterprise,secLDAP,secWinAD,secSAPR3\">secEnterprise</attr>\r\n    <attr name=\"userName\" type=\"string\">" + username + "</attr>\r\n    <attr name=\"clientType\" type=\"string\"></attr>\r\n</attrs>",
        statusCode: {
          401: function() {$("#iCMSName").html(vHTMLHTTP401);fnCloseLoader()},
          404: function() {$("#iCMSName").html(vHTMLHTTP404);fnCloseLoader()},
          500: function() {$("#iCMSName").html(vHTMLHTTP500);fnCloseLoader()},
        },
        success: function(data) {
          // console.log(data);
          var tkn = data.logonToken;
          var clustername = tkn.substring(0,tkn.indexOf("@"));
          window.localStorage.setItem('lgntkn',tkn);
          $("#iCMSName").html("Connected to:  " + '<b style="text-transform: uppercase";>' + clustername + "</b>");
          $("#iConnectedUser").html("&check;" +username);
          $("#iLogOffBtn").show();
        },
      error: function (data) {
        $("#iCMSName").html('<a style="color:red";>Not Connected</a>');
        $("#iLogOffBtn").hide();
  
      }
      });
    });
  
    $("#iLogOffBtn").click(function() {
      if ("lgntkn" in window.localStorage) {
        fnInitLoader();
      $.ajax({
        url: `/${vBaseURL}/logoff`,
        type: "POST",
        headers: {"X-SAP-LogonToken": window.localStorage.getItem("lgntkn"),"Accept": "application/xml"},
        statusCode: {
          200: function() {fnDisplayDetailedErrorMessage(200)},
          401: function() {fnDisplayDetailedErrorMessage(401)},
          404: function() {fnDisplayDetailedErrorMessage(404)},
        },
        success: function(data) {
          window.localStorage.removeItem("lgntkn");
          location.reload(true);
        },
      error: function (data) {
        window.localStorage.removeItem("lgntkn");
      }
      });
    } else {
      console.print("No session exists.");
  };
    });

    //Add HTML Elements, Classes, ID's
    $(".cMainBodyWrapper").children('nav').attr( 'id', 'iMainNavigation');
    $(".cMainBodyWrapper").children('nav').addClass('cMainNavigation');
    $("#iMainNavigation").children('div').addClass('cNavContent');
    $("#iMainNavigation").append(vHTMLVer);
    $(".cNavContent").prepend(vHTMLLogoandUser);    
    $(".cNavContent").children('ul').addClass('cClassList');
    $(".cClassList").children('li').addClass('cClassName');
    $(".cClassName").children('a').addClass('cClassExpanded');
    $(".cClassName").children('ul').addClass('cViewUL');
    $(".cViewUL").children('li').addClass('cViewName');
    $(".cViewName").children('a').addClass('cViewLink')
    $(".cContentStruct").prepend(vHTMLViewContent);
    $(".cMainSection").append(vHTMLFooter);
    $('#iAppLogo').empty().html(vAppName);
    $('#iAppVer').empty().html("v" + vAppVer.toFixed(1));

    // Menu Collapse/Expand Function
        $('li').filter(function(i) { return $('ul', this).length >= 1; }).each(function(i) {
          $(this).children("a")
          .click(function(e) {
              let $ul = $(this).next("ul");
              let $li = $ul.parent('li');
              if ($ul.is(":visible")) {
                  $ul.slideUp(100,function() {
                    $li.children(":first").removeClass("cClassExpanded");
                    $li.children(":first").addClass("cClassCollapsed");
                  }
                );
              }
              else {
                  $ul.slideDown(100,function() {
                    $li.children(":first").removeClass("cClassCollapsed");
                    $li.children(":first").addClass("cClassExpanded");                  
                    });
              };
          })
      });
      
      // Navigation Panel Collapse/Expand Function
      $(".cNavigationPanelToggle").on('click','#iNavigationPanelToggle',function() {
        $("#iMainNavigation").toggle();
      })
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* 
  Usage: User clicks on the app name in the nav bar.
  First, select your common ancestor element (.cClassList in this example). You can use document here too if you want to handle all a elements.
  Pass the event type (on), then the sub selector (a), and then the callback function for the event.
  Now, when click events bubble up to .cClassList, it will check to see if the element is an a element, and if so, fire the callback.
  */
 // Load View Section
  $(".cClassList").on('click','.cViewLink', function() {
    fnLoadView($(this).attr("id"));
    vSelectedViewID = $(this).attr("id");
    });
 
  /* 
  on() method: This method attaches events not only to existing elements but also for the ones appended in the future as well.
  The performance gain is only seen when using event delegation by passing a selector parameter. 
  If you call .on() without a selector parameter there is no performance improvement over using .click()
  https://api.jquery.com/on/#direct-and-delegated-events
  */
 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Call view specific funtion after View button is clicked
 function fnInitViewFunction(pViewLinkID) {
  switch (pViewLinkID) {
    //Servers
    case 'iServerStatusLink':fRQ('allsrv');break;
    case 'iServerCommandLineLink':fRQ('allsrvcmd');break;
    case 'iServerAPSLink':fRQ('allaps');break;
    //Semantic
    case 'iAllUNXLink':fRQ('allunx');break;
    case 'iAllUNVLink':fRQ('allunv');break;
    //Connections
    case 'iAllRelConLink':fRQ('allrel');break;
    case 'iAllBAPILink':fRQ('allbapi');break;
    case 'iAllOLAPLink':fRQ('allolap');break;
    //Auth
    case 'iAllHANASAMLAuthLink':fRQ('allhanasaml');break;
  }
 };

 // Capture user click on View button and init fnInitViewFunction
  $("#iViewActions").on('click', '#iViewButton',function(){
    fnInitViewFunction(vSelectedViewID);
    });
  
  // Hide Columns
    $("#iViewActions").on('click', '.cButton',function(){
      switch(this.id) {
        case 'iShowHideCUID': $('td:nth-child(2),th:nth-child(2)').toggle();break;
        case 'iShowHideID': $('td:nth-child(3),th:nth-child(3)').toggle();break;
      };
    });
  });