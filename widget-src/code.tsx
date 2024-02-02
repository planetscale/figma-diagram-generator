import { table } from "console";

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input } = widget
const { Parser } = require('node-sql-parser');
const { DBComponents } = require('./dbcomponents.tsx');

const tables_and_columns = new Map<string, Map<String, GroupNode>>();

let col_name = entry.column.column;
if (DBComponents.isPK(table_info, col_name);

function generateTable(table_info:any, x:number, y:number) {
  const nodes:SceneNode[] = [];
  nodes.push(DBComponents.createTableTitleRect(x, y, table_info.table[0].table));

  tables_and_columns.set(table_info.table[0].table, new Map<String, GroupNode>());

  let col_count = 0;
  for (let i =0; i < table_info.create_definitions.length; i++) {
    let entry = table_info.create_definitions[i];
    if (entry.resource != 'column')
      continue;
    const rect = DBComponents.createColumnRect(x, y+55+(i*55), entry);

    nodes.push(rect);
    col_count++;
    let tc = tables_and_columns.get(table_info.table[0].table)!;
    let col_name = entry.column.column;
    tc.set(col_name, rect);

    if (DBComponents.isPK(table_info, col_name)) {
      nodes.push(DBComponents.createKeyIcon(x+410, y+55+(i*55)+10, "PK", {r:0.2, g:0.5, b:1.0}));
    }

    const fk = DBComponents.isFK(table_info, col_name);
    if (fk) {
      nodes.push(DBComponents.createKeyIcon(x+410, y+55+(i*55)+10, "FK", {r:0.2, g:1.0, b:0.5}));
      let to = tables_and_columns.get(fk.table)?.get(fk.column)!;
      DBComponents.connectElements(rect, to);
    }
  }

  nodes.push(DBComponents.createFrame(x-10, y-10, 470, 55 * (1+col_count)+20));

  figma.viewport.scrollAndZoomIntoView(nodes);
  figma.group(nodes, figma.currentPage);
}

function generateDiagram(ddl:string) {
  const parser = new Parser();
  const result:Array<Object> = parser.astify(ddl);
  DBComponents.loadFonts().then(() => {
    for (let i = 0;i < result.length; i++) {
      generateTable(result[i], i*500, 0);
    }
  });
  console.log(result);
}

function Widget() {
  const [tokenID, setTokenID] = useSyncedState("tokenID", "");
  const [token, setToken] = useSyncedState("token", "");
  const [org, setOrg] = useSyncedState("org", "");
  const [database, setDatabase] = useSyncedState("database", "");
  const [branch, setBranch] = useSyncedState("branch", "");

  return (
    <AutoLayout direction="vertical" spacing={10}>

      <Input value={tokenID} fontSize={10} width={200} height={30}
        inputFrameProps={{fill:"#fff", stroke:"#000", cornerRadius:10, padding:10}}
        onTextEditEnd={(e) => { setTokenID(e.characters); }}/>
      
      <Input value={token} fontSize={10} width={200} height={30}
        inputFrameProps={{fill:"#fff", stroke:"#000", cornerRadius:10, padding:10}}
        onTextEditEnd={(e) => { setToken(e.characters); }}/>
      
      <Input value={org} fontSize={10} width={200} height={30}
        inputFrameProps={{fill:"#fff", stroke:"#000", cornerRadius:10, padding:10}}
        onTextEditEnd={(e) => { setOrg(e.characters); }}/>
      
      <Input value={database} fontSize={10} width={200} height={30}
        inputFrameProps={{fill:"#fff", stroke:"#000", cornerRadius:10, padding:10}}
        onTextEditEnd={(e) => { setDatabase(e.characters); }}/>
      
      <Input value={branch} fontSize={10} width={200} height={30}
        inputFrameProps={{fill:"#fff", stroke:"#000", cornerRadius:10, padding:10}}
        onTextEditEnd={(e) => { setBranch(e.characters); }}/>

      <Text fontSize={20}
        onClick={(e) =>

          (async () => {
            const url = "https://api.planetscale.com/v1/organizations/" + org +
                     "/databases/" + database +
                     "/branches/" + branch + "/schema";
            const response = await fetch(url, {method: 'GET', headers:{
              "Authorization": tokenID + ":" + token
            }});
            const object = await response.json();
            let creates = "";
            for (let i = 0; i < object.data.length; i++) {
              creates += object.data[i].raw;
            }
            generateDiagram(creates);
          })()
        }>
        Generate Diagram!
      </Text>
    </AutoLayout>
  );
}

widget.register(Widget)
