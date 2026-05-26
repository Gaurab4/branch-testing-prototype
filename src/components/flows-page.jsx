import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import AddIcon from "@mui/icons-material/Add";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useAppDispatch, useAppSelector } from "@/store/hooks.js";
import { openCreateFlowModal } from "@/store/appSlice.js";
import { runFlow } from "@/store/thunks.js";

const statusChip = {
  passed: { label: "Passed", color: "success" },
  failed: { label: "Failed", color: "error" },
  running: { label: "Running", color: "warning" },
  never: { label: "—", color: "default", variant: "outlined" },
};

export function FlowsPage() {
  const dispatch = useAppDispatch();
  const flows = useAppSelector((s) => s.app.flows);

  return (
    <Box sx={{ p: { xs: 3, sm: 4 } }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Flows
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create and manage your flows. Flows are natural language test
            scenarios.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<CreateNewFolderOutlinedIcon />}
          >
            Create Suite
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => dispatch(openCreateFlowModal())}
          >
            Create Flow
          </Button>
          <IconButton aria-label="Upload" sx={{ border: 1, borderColor: "divider" }}>
            <UploadOutlinedIcon />
          </IconButton>
        </Box>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          mb: 5,
          p: 5,
          textAlign: "center",
          borderStyle: "dashed",
          bgcolor: "action.hover",
        }}
      >
        <FolderOpenOutlinedIcon
          sx={{ fontSize: 40, color: "text.disabled", mb: 1 }}
        />
        <Typography fontWeight={500}>
          You haven&apos;t created any suites yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Organize flows to run faster and more efficiently.
        </Typography>
      
      </Paper>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        All Flows
      </Typography>

      {flows.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 6,
            textAlign: "center",
            borderStyle: "dashed",
            bgcolor: "action.hover",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No flows yet. Create your first flow to start testing.
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => dispatch(openCreateFlowModal())}
          >
            Create Your First Flow
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell>Name</TableCell>
                <TableCell>Suites</TableCell>
                <TableCell>Latest Status</TableCell>
                <TableCell>Last Run</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flows.map((flow) => {
                const chip = statusChip[flow.latestStatus];
                return (
                  <TableRow key={flow.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{flow.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>—</TableCell>
                    <TableCell>
                      <Chip
                        label={chip.label}
                        color={chip.color}
                        variant={chip.variant ?? "filled"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {flow.lastRun}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        aria-label="Run flow"
                        onClick={() => dispatch(runFlow(flow.id))}
                      >
                        <PlayArrowIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Edit flow"
                        onClick={() => dispatch(openCreateFlowModal())}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" aria-label="More">
                        <MoreHorizIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
