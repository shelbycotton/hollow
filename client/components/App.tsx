// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';
import { AppState } from './interface.ts';
import Sidebar from './sidebar/Sidebar.tsx';
import Header from './header/Header.tsx';
import ActiveCollection from "./dashboard/activeCollection/ActiveCollection.tsx";

/**
 * @description holds state of app & renders app
 * @state activeItem - stores name of currently selected collection
 * @state view - stores current view (collection, content-builder, plugins, settings)
 */
class App extends React.Component<{}, AppState> {
  constructor(props: any){
    super(props);
    this.state = { activeItem: '', view: 'collection', collections: [], collectionHeaders: [], collectionEntries: [[]] };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch('/api/tables')
      .then(data => data.json())
      .then((data) => {
        this.setState({ ...this.state, activeItem: data.data[0], collections: this.state.collections.concat(data.data) })
      })
      .then(() => {
        fetch(`/api/tables/${this.state.activeItem}`)
          .then(data => data.json())
          .then(data => {
            const headers = data.data.columns.map((header: any) => header.column_name)
            const entries = data.data.rows.map((entry:any) => Object.values(entry).map(value => value));
            this.setState({ ...this.state, collectionHeaders: headers, collectionEntries: entries } );
          })
          .catch(error => console.log('error', error));
      })
      .catch(error => console.log('error', error));
  };



  /**
   * @description sets state to active item (collection or tool) on click of sidebar item
   * @param event
   */
  handleClick(event: React.MouseEvent) {
    // @ts-ignore
    const active = event.target.innerText;
    // Sets correct view based on which item was clicked
    switch(active) {
      case 'Settings':
        if (this.state.view !== 'settings') {
          this.setState({ activeItem: active, view: 'settings' });
        }
        break;
      case 'Content-Builder':
        if (this.state.view !== 'content-builder') {
          this.setState({ activeItem: active, view: 'content-builder' });
        }
        break;
      case 'Plugins':
        if (this.state.view !== 'plugins') {
          this.setState({ activeItem: active, view: 'plugins' });
        }
        break;
      default:
        if (this.state.view !== 'collection') {
          this.setState({ view: 'collection', activeItem: active });
        } else {
          this.setState({ activeItem: active });
        }
    }
    if (this.state.view === 'collection') {
      fetch(`/api/tables/${active}`)
          .then(data => data.json())
          .then(data => {
            const headers = data.data.columns.map((header: any) => header.column_name)
            const entries = data.data.rows.map((entry:any) => Object.values(entry).map(value => value));
            this.setState({ ...this.state, collectionHeaders: headers, collectionEntries: entries } );
          })
          .catch(error => console.log('error', error));
    }
  };

  render () {
    // will need to get current collections from api - these are dummy values for testing
    const currentCollections = this.state.collections;
    const currentTools = ['Content-Builder', 'Plugins'];

    let activeView;

    if (this.state.view === 'collection') {
      activeView = <ActiveCollection activeCollection={this.state.activeItem} collectionHeaders={this.state.collectionHeaders} collectionEntries={this.state.collectionEntries} />;
    } else if (this.state.view === 'content-builder') {
      // need to create content builder compononent before assinging to activeView
      // activeView = <ContentBuilder />
      activeView = <div></div>;
    } else if (this.state.view === 'plugins') {
      // need to create plugins compononent before assinging to activeView - or not. dont really have a use for it atm
      // activeView = <Plugins />
      activeView = <div></div>;
    } else if (this.state.view === 'settings') {
      // need to create settings compononent before assinging to activeView
      // activeView = <Settings />
      activeView = <div></div>;
    }

    return (
      <div>
        <Header text='hi' />
        <Sidebar
          activeItem={this.state.activeItem}
          currentCollections={currentCollections} 
          currentTools={currentTools} 
          handleClick={this.handleClick}  
        />
        {activeView}
      </div>
    );
  }
}

export default App;
