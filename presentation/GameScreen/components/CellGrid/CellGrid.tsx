import React, { useState, useCallback, useRef, useEffect } from "react";
import produce from "immer";
import { ScrollView, View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";
import { Row } from "react-native-easy-grid";
import Cell from "../Cell";
import generateEmptyGrid from "../../../../application/GameLogic/generateEmptyGrid";
import { ActionsRow } from "./../ActionsRow/ActionsRow";
import gameLogic from "../../../../application/GameLogic/gameLogic";

const StyledGrid = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
`;
const StyledGenerationsContainer = styled.View`
  height: 50px;
  justify-content: center;
  align-items: center;
  background-color: #202020;
`;
const StyledGenerationsText = styled.Text`
  color: white;
  font-size: 20px;
  font-family: "VCR";
`;

const CellGrid = () => {
  const [generations, setGenerations] = useState(0);
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid(gameLogic);
    setGenerations((g) => g + 1);
  }, []);
  useEffect(() => {
    setTimeout(runSimulation, 100);
  }, [grid]);

  return (
    <ScrollView>
      <StyledGrid>
        {grid.map((rows, i) => (
          <Row key={`${i}`}>
            {rows.map((col, k) => (
              <Cell
                key={`${i}-${k}`}
                onPress={() => {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
                i={i}
                k={k}
                grid={grid}
              />
            ))}
          </Row>
        ))}
      </StyledGrid>
      <ActionsRow
        toggleRunning={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
        running={running}
        setGrid={setGrid}
      />
      <StyledGenerationsContainer>
        <StyledGenerationsText>
          Generations: {generations}
        </StyledGenerationsText>
      </StyledGenerationsContainer>
      <View style={{ height: Dimensions.get("window").height * 0.15 }} />
    </ScrollView>
  );
};

export default CellGrid;
