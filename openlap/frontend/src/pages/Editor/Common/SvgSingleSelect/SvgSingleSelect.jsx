import { ToggleButton, Box } from "@mui/material";
import config from "./config.js"

/**@author Louis Born <louis.born@stud.uni-due.de> */
export default function SvgSingleSelect({ name, dataSource, itemName, handleChange }) {
    const currentSelection = itemName.name;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {dataSource.map(e => {
                const imgUrl = import.meta.env.BASE_URL + `src/assets/img/vis-chart-types/${e.implementingClass}.svg`;
                const findChart = config.find(chartName => chartName.name === e.name)

                return (
                    <div key={imgUrl} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignContent: 'center', maxWidth: '56px' }}>
                        <ToggleButton
                            value={e}
                            aria-label={e.name}
                            onClick={handleChange}
                            selected={(e.name === currentSelection)}
                            sx={{ height: '56px', width: '56px' }}
                        >
                            <Box
                                component="img"
                                src={findChart.image}
                                alt={e.id}
                            />
                        </ToggleButton>
                        <span style={{ fontSize: '10px', textAlign: 'center', marginTop: '4px' }}>{e.name}</span>
                    </div>
                );
            })}
        </div>
    );
}