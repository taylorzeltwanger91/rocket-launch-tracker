# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org).

## [1.1.0] - 2026-02-09

### Changed
- Replaced all mock launch data with accurate real-world mission data sourced from SpaceX, ULA, NASA, Blue Origin, Rocket Lab, Firefly Aerospace, and Boeing
- Updated launch data: Starlink 17-34, Crew-12, USSF-87, Starlink 6-103, New Glenn NG-3, QuickSounder, Artemis II, Starship Flight 12, Starliner-1, Neutron Flight 1
- Fixed dates to use real scheduled launch times instead of relative offsets
- Added NASA filter option

### Fixed
- ULA filter now works correctly (provider name was not matching substring search)

## [1.0.0] - 2026-02-09

### Added
- Initial release of Rocket Launch Tracker
- Launch list view with upcoming U.S. launches
- Live countdown timers for each launch
- Detail view with mission info, vehicle, launch pad, and location
- Status badges (Go, Scheduled, Hold, Delayed, Scrubbed, Launched)
- Filter launches by All, Soon, SpaceX, and ULA
- Next Launch hero card with prominent countdown
- Animated star field background
- Notification toggle settings (UI only)
- GitHub Pages deployment via GitHub Actions
