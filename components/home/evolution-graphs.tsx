'use client'

import EvolutionGraph from "./evolution-graph"
import { EvolutionGraphProps } from "./evolution-graph";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export type EvolutionProps = {
  populationProps: EvolutionGraphProps
  offspringProps: EvolutionGraphProps
}

export default function Evolution({populationProps, offspringProps}: EvolutionProps) {
  return(
    <Tabs>
      <TabList className="bg-transparent">
        <Tab  selectedClassName="bg-gray-200">Population Evolution</Tab>
        <Tab selectedClassName="bg-gray-200">Offspring Evolution</Tab>
      </TabList>

      <TabPanel>
        {EvolutionGraph(populationProps)}
      </TabPanel>

      <TabPanel>
        {EvolutionGraph(offspringProps)}
      </TabPanel>
    </Tabs>
  )}
