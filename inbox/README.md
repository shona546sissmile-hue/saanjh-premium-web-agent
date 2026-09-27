# Inbox

Drop client materials here before saying **"Start client project"**: notes,
PDFs, images, video, logos, brand guides, copy, screenshots, anything.
Messy is fine; the agent organises it. See [`CLIENT-INTAKE.md`](../CLIENT-INTAKE.md).

- One client: put files straight in `inbox/`, or in `inbox/<client-name>/`.
- Several clients waiting: use one subfolder per client.
- Links and notes can go in any text file here, or directly in your message.

Everything in this folder except this README is **git-ignored**, so client
material never lands on `main`. When a project starts, the agent copies the
files into the client's own branch (`project/brief/originals/`) and commits
them there, verifying each copy's checksum.

**The agent never deletes, moves or modifies anything in this folder.** It
stays as your backup of the original material until you clean it out
yourself. Until a project starts, the files exist only in this workspace.
