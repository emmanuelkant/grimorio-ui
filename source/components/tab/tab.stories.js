import React from 'react';
import { storiesOf } from '@storybook/react';
import { withState } from '@dump247/storybook-state';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import TabMenu, { Tab } from './';
import Panel from '../panel';
import Button from '../button';

const tabGen = (arr, icon = false) => arr.map(i => ({
  id: `tab${i}`,
  value: `value-tab${i}`,
  content: `Tab ${i}`,
  ...(icon && { icon })
}));

const tabs = tabGen([1,2,3]);
const tabsBig = tabGen([1,2,3,4,5,6,7]);

const stories = storiesOf('Tab', module);

stories.addDecorator(withKnobs);

stories.add('Default', () => {
  return (
    <Panel size="no-padding" style={{ width: '500px', marginLeft: '150px' }}>
      <TabMenu
        tabs={tabs}
        defaultActive="tab2"
        activeIndex={1}
        onChange={action('onChange: id, value')}
        tabDisplay="full"
      />
    </Panel>
  );
});

stories.add('Inline (default)', () => {
  return (
    <TabMenu
      tabs={tabs}
      defaultActive="tab2"
      onChange={action('onChange: id, value')}
    />
  );
});

stories.add('Full', () => {
  return (
    <TabMenu
      tabs={tabs}
      defaultActive="tab2"
      onChange={action('onChange: id, value')}
      tabDisplay="full"
    />
  );
});

stories.add('Center', () => {
  return (
    <TabMenu
      tabs={tabs}
      defaultActive="tab2"
      onChange={action('onChange: id, value')}
      tabDisplay="center"
    />
  );
});

stories.add('With Icon', () => {
  return (
    <TabMenu
      tabs={tabGen([1,2,3], 'favorite')}
      defaultActive="tab1"
      onChange={action('onChange: id, value')}
      tabDisplay="center"
    />
  );
});

stories.add('Active Style', () => {
  return (
    <div>
      <TabMenu activeStyle="primary" defaultActive="1" onChange={action('onChange: id, value')}>
        <Tab id="1" value="value 1">Primary</Tab>
        <Tab id="2" value="value 2">Active</Tab>
        <Tab id="3" value="value 3">Style</Tab>
      </TabMenu>
      <br/>
      <br/>
      <TabMenu activeStyle="secondary" defaultActive="1" onChange={action('onChange: id, value')}>
        <Tab id="1" value="value 1">Secondary</Tab>
        <Tab id="2" value="value 2">Active</Tab>
        <Tab id="3" value="value 3">Style</Tab>
      </TabMenu>
    </div>
  );
});

stories.add('Manual', () => {
  return (
    <div>
      <TabMenu defaultActive="acom" onChange={action('onChange: id, value')}>
        <Tab id="acom" value="Americanas.com" iconLeft="heart">Acom</Tab>
        <Tab id="suba" value="Submarino" iconTop="heart">Suba</Tab>
        <Tab id="shop" value="Shoptime">Shop</Tab>
      </TabMenu>
      <br/>
      <br/>
      <br/>
      <TabMenu defaultActive="acom" onChange={action('onChange: id, value')}>
        <Tab id="acom" value="Americanas.com" iconLeft="heart">Palavra</Tab>
        <Tab id="suba" value="Submarino" iconTop="heart">Uma frase grande</Tab>
        <Tab id="shop" value="Shoptime">Outra grande frase na tab</Tab>
      </TabMenu>
    </div>
  );
});

stories.add('With Array', () => {
  return (
    <TabMenu
      tabs={tabsBig}
      defaultActive="tab5"
      onChange={action('onChange: id, value')}
    />
  );
});


stories.add(
  'Controlled',
  withState({ selected: 'tab1' })(({ store }) => {
    const setVal = id => {
      store.set({ selected: id });
    };

    return (
      <div>
        <TabMenu
          tabs={tabGen([1,2,3], 'favorite')}
          active={store.state.selected}
          onChange={setVal}
          tabDisplay="center"
        />
        <Button onClick={() => setVal('tab3')}>Change to Tab3</Button>
      </div>
    );
  })
);

